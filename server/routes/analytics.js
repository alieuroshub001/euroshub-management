const express = require('express');
const mongoose = require('mongoose');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get MongoDB storage analytics
router.get('/storage', auth, authorize(['superadmin']), async (req, res) => {
  try {
    const admin = mongoose.connection.db.admin();
    const mongoClient = mongoose.connection.getClient();
    
    // Get server status
    const serverStatus = await admin.serverStatus();
    
    // Get database list with stats
    const databases = [];
    const dbList = await admin.listDatabases({ listCollections: true });
    
    let totalObjects = 0;
    let totalDataSize = 0;
    let totalStorageSize = 0;
    let totalIndexSize = 0;

    for (const dbInfo of dbList.databases) {
      try {
        const db = mongoClient.db(dbInfo.name);
        const dbStats = await db.stats();
        
        // Get collections info
        const collections = await db.listCollections().toArray();
        const collectionsDetail = [];
        
        for (const collection of collections) {
          try {
            const collStats = await db.collection(collection.name).stats();
            collectionsDetail.push({
              name: collection.name,
              documents: collStats.count || 0,
              size: collStats.size || 0,
              storageSize: collStats.storageSize || 0,
              indexes: collStats.nindexes || 0,
              indexSize: collStats.totalIndexSize || 0
            });
          } catch (err) {
            // Skip collections that can't be accessed
            collectionsDetail.push({
              name: collection.name,
              documents: 0,
              size: 0,
              storageSize: 0,
              indexes: 0,
              indexSize: 0
            });
          }
        }

        const databaseInfo = {
          name: dbInfo.name,
          sizeOnDisk: dbStats.fsUsedSize || dbStats.storageSize || 0,
          collections: dbStats.collections || collections.length,
          objects: dbStats.objects || 0,
          dataSize: dbStats.dataSize || 0,
          storageSize: dbStats.storageSize || 0,
          indexSize: dbStats.indexSize || 0,
          totalSize: (dbStats.dataSize || 0) + (dbStats.indexSize || 0),
          avgObjSize: dbStats.avgObjSize || 0,
          collectionsDetail: collectionsDetail,
          isCurrentDatabase: dbInfo.name === mongoose.connection.name
        };

        databases.push(databaseInfo);
        
        totalObjects += databaseInfo.objects;
        totalDataSize += databaseInfo.dataSize;
        totalStorageSize += databaseInfo.storageSize;
        totalIndexSize += databaseInfo.indexSize;
        
      } catch (error) {
        // Add database with error info
        databases.push({
          name: dbInfo.name,
          sizeOnDisk: dbInfo.sizeOnDisk || 0,
          collections: 0,
          objects: 0,
          dataSize: 0,
          storageSize: 0,
          indexSize: 0,
          totalSize: 0,
          avgObjSize: 0,
          collectionsDetail: [],
          isCurrentDatabase: dbInfo.name === mongoose.connection.name,
          error: `Access denied or error: ${error.message}`
        });
      }
    }

    // Calculate cluster usage (MongoDB Atlas free tier is 512MB)
    const clusterLimit = 512 * 1024 * 1024; // 512MB in bytes
    const totalSizeOnDisk = dbList.totalSizeOnDisk || databases.reduce((sum, db) => sum + db.sizeOnDisk, 0);
    const usedPercentage = (totalDataSize / clusterLimit) * 100;
    
    const clusterUsage = {
      totalSizeOnDisk: totalSizeOnDisk,
      totalDataSize: totalDataSize,
      clusterLimit: clusterLimit,
      availableSpace: clusterLimit - totalDataSize,
      usedPercentage: Math.min(usedPercentage, 100),
      isNearLimit: usedPercentage > 80,
      isAtLimit: usedPercentage > 95,
      cacheSize: serverStatus.wiredTiger?.cache?.['maximum bytes configured'] || null,
      cacheUsed: serverStatus.wiredTiger?.cache?.['bytes currently in the cache'] || null
    };

    const responseData = {
      instance: {
        totalDatabases: databases.length,
        totalSize: totalDataSize + totalIndexSize,
        totalSizeOnDisk: totalSizeOnDisk,
        totalObjects: totalObjects,
        currentDatabase: mongoose.connection.name,
        clusterUsage: clusterUsage
      },
      databases: databases,
      mongodb: {
        version: serverStatus.version,
        connectionState: mongoose.connection.readyState,
        host: serverStatus.host || 'localhost',
        port: serverStatus.port || 27017,
        storageEngine: serverStatus.storageEngine?.name || 'unknown'
      }
    };

    res.json({
      success: true,
      data: responseData
    });

  } catch (error) {
    console.error('Storage analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch storage analytics',
      error: error.message
    });
  }
});

module.exports = router;