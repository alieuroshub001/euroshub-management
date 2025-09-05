import { useState, useEffect } from 'react';
import { 
  Server, 
  Database, 
  RefreshCw,
  BarChart3,
  FileText,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import './SystemSettings.css';

const API_URL = 'http://localhost:5000/api';

function SystemSettings() {
  const [storageData, setStorageData] = useState(null);
  const [selectedDatabase, setSelectedDatabase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchStorageData = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/analytics/storage`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();

      if (data.success) {
        setStorageData(data.data);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error fetching storage data:', error);
      setError('Failed to fetch storage information');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStorageData();
  }, []);

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getConnectionStatus = (state) => {
    const states = {
      0: { text: 'Disconnected', color: 'status-error' },
      1: { text: 'Connected', color: 'status-success' },
      2: { text: 'Connecting', color: 'status-warning' },
      3: { text: 'Disconnecting', color: 'status-warning' }
    };
    return states[state] || { text: 'Unknown', color: 'status-default' };
  };

  if (loading) {
    return (
      <div className="system-settings">
        <div className="settings-card">
          <div className="loading-container">
            <div className="loading-content">
              <RefreshCw className="loading-spinner" />
              <span>Loading storage information...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="system-settings">
        <div className="settings-card">
          <div className="error-container">
            <div className="error-content">
              <div className="error-title">Error loading storage data</div>
              <div className="error-message">{error}</div>
              <button
                onClick={() => fetchStorageData()}
                className="retry-button"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!storageData) return null;

  const { instance, databases, mongodb } = storageData;
  const connectionStatus = getConnectionStatus(mongodb.connectionState);
  const selectedDb = selectedDatabase 
    ? databases.find(db => db.name === selectedDatabase)
    : databases.find(db => db.isCurrentDatabase) || databases[0];

  return (
    <div className="system-settings">
      {/* Header */}
      <div className="settings-card">
        <div className="card-header">
          <div className="header-left">
            <Database className="header-icon" />
            <div>
              <h2 className="header-title">MongoDB Instance Monitor</h2>
              <p className="header-subtitle">
                {instance.totalDatabases} databases • Current: {instance.currentDatabase}
              </p>
            </div>
          </div>
          <button
            onClick={() => fetchStorageData(true)}
            disabled={refreshing}
            className={`refresh-button ${refreshing ? 'refreshing' : ''}`}
          >
            <RefreshCw className={refreshing ? 'spinning' : ''} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Instance Overview */}
      <div className="settings-card">
        <div className="section-header">
          <BarChart3 className="section-icon" />
          <h3 className="section-title">Instance Overview</h3>
        </div>
        
        <div className="metrics-grid">
          <div className="metric-card metric-blue">
            <div className="metric-label">Total Databases</div>
            <div className="metric-value">{instance.totalDatabases}</div>
          </div>
          <div className="metric-card metric-green">
            <div className="metric-label">Atlas Usage</div>
            <div className="metric-value">{formatBytes(instance.clusterUsage.totalDataSize)}</div>
            <div className="metric-note">Matches Atlas dashboard</div>
          </div>
          <div className="metric-card metric-orange">
            <div className="metric-label">Disk Usage</div>
            <div className="metric-value">{formatBytes(instance.totalSizeOnDisk)}</div>
            <div className="metric-note">Physical storage</div>
          </div>
          <div className="metric-card metric-purple">
            <div className="metric-label">Total Documents</div>
            <div className="metric-value">{instance.totalObjects.toLocaleString()}</div>
          </div>
        </div>

        {/* Cluster Storage Quota */}
        <div className="quota-section">
          <div className="quota-header">
            <h4 className="quota-title">MongoDB Cluster Storage Quota</h4>
            <div className="quota-total">
              {formatBytes(instance.clusterUsage.clusterLimit)} total
            </div>
          </div>
          
          <div className="quota-details">
            {/* Main Storage Progress Bar */}
            <div className="progress-bar">
              <div 
                className={`progress-fill ${
                  instance.clusterUsage.isAtLimit 
                    ? 'progress-danger'
                    : instance.clusterUsage.isNearLimit
                    ? 'progress-warning'
                    : 'progress-success'
                }`}
                style={{ 
                  width: `${Math.min(Math.max(instance.clusterUsage.usedPercentage, 2), 100)}%`
                }}
              >
                {instance.clusterUsage.usedPercentage.toFixed(1)}%
              </div>
            </div>
            
            {/* Usage Statistics */}
            <div className="usage-stats">
              <div className="usage-stat">
                <div className="usage-value">{formatBytes(instance.clusterUsage.totalDataSize)}</div>
                <div className="usage-label">Used</div>
              </div>
              <div className="usage-stat">
                <div className="usage-value">{formatBytes(instance.clusterUsage.availableSpace)}</div>
                <div className="usage-label">Available</div>
              </div>
              <div className="usage-stat">
                <div className="usage-value">{formatBytes(instance.clusterUsage.clusterLimit)}</div>
                <div className="usage-label">Total Quota</div>
              </div>
            </div>

            {/* Warning Messages */}
            {instance.clusterUsage.isAtLimit && (
              <div className="alert alert-danger">
                <div className="alert-header">
                  <AlertTriangle className="alert-icon" />
                  <span className="alert-title">Storage Limit Reached!</span>
                </div>
                <p className="alert-message">
                  You're at 95%+ of your cluster storage limit. Consider upgrading your plan or cleaning up data.
                </p>
              </div>
            )}

            {instance.clusterUsage.isNearLimit && !instance.clusterUsage.isAtLimit && (
              <div className="alert alert-warning">
                <div className="alert-header">
                  <AlertTriangle className="alert-icon" />
                  <span className="alert-title">Storage Warning</span>
                </div>
                <p className="alert-message">
                  You're using over 80% of your cluster storage limit. Monitor usage closely.
                </p>
              </div>
            )}

            {/* Cluster Tier Info */}
            <div className="alert alert-info">
              <div className="alert-header">
                <CheckCircle className="alert-icon" />
                <span className="alert-title">
                  {instance.clusterUsage.clusterLimit === 512 * 1024 * 1024 ? 'Free Tier (M0)' : 'Paid Cluster'}
                </span>
              </div>
              <p className="alert-message">
                {instance.clusterUsage.clusterLimit === 512 * 1024 * 1024 
                  ? 'Free MongoDB Atlas cluster with 512MB storage limit'
                  : `Custom cluster with ${formatBytes(instance.clusterUsage.clusterLimit)} storage limit`
                }
              </p>
            </div>

            {/* Cache Information if available */}
            {instance.clusterUsage.cacheSize && (
              <div className="cache-info">
                <div className="cache-header">
                  <span className="cache-title">WiredTiger Cache</span>
                  <span className="cache-usage">
                    {formatBytes(instance.clusterUsage.cacheUsed || 0)} / {formatBytes(instance.clusterUsage.cacheSize)}
                  </span>
                </div>
                <div className="cache-progress">
                  <div 
                    className="cache-fill"
                    style={{ 
                      width: instance.clusterUsage.cacheUsed && instance.clusterUsage.cacheSize 
                        ? `${Math.min((instance.clusterUsage.cacheUsed / instance.clusterUsage.cacheSize) * 100, 100)}%`
                        : '0%'
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Database Selection */}
      <div className="settings-card">
        <h3 className="section-title">Databases</h3>
        <div className="databases-grid">
          {databases.map((db) => (
            <div
              key={db.name}
              onClick={() => setSelectedDatabase(db.name)}
              className={`database-card ${
                selectedDb?.name === db.name ? 'database-selected' : ''
              }`}
            >
              <div className="database-header">
                <h4 className="database-name">{db.name}</h4>
                {db.isCurrentDatabase && (
                  <span className="database-badge">Current</span>
                )}
              </div>
              <div className="database-stats">
                <div className="database-stat">Size: {formatBytes(db.totalSize)}</div>
                <div className="database-stat">Collections: {db.collections}</div>
                <div className="database-stat">Documents: {db.objects.toLocaleString()}</div>
              </div>
              {db.error && (
                <div className="database-error">
                  {db.error}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Connection Status */}
      <div className="settings-card">
        <div className="section-header">
          <Server className="section-icon" />
          <h3 className="section-title">Connection Status</h3>
        </div>
        <div className="connection-grid">
          <div className="connection-item">
            <div className="connection-label">Status</div>
            <div className={`connection-status ${connectionStatus.color}`}>
              {connectionStatus.text}
            </div>
          </div>
          <div className="connection-item">
            <div className="connection-label">Host</div>
            <div className="connection-value">{mongodb.host}:{mongodb.port}</div>
          </div>
          <div className="connection-item">
            <div className="connection-label">MongoDB Version</div>
            <div className="connection-value">v{mongodb.version}</div>
          </div>
          <div className="connection-item">
            <div className="connection-label">Storage Engine</div>
            <div className="connection-value">{mongodb.storageEngine}</div>
          </div>
          <div className="connection-item">
            <div className="connection-label">Total Collections</div>
            <div className="connection-value">{databases.reduce((total, db) => total + db.collections, 0)}</div>
          </div>
        </div>
      </div>

      {/* Selected Database Details */}
      {selectedDb && (
        <>
          <div className="settings-card">
            <div className="section-header">
              <BarChart3 className="section-icon" />
              <h3 className="section-title">
                Database: {selectedDb.name}
                {selectedDb.isCurrentDatabase && (
                  <span className="database-badge ml-2">Current</span>
                )}
              </h3>
            </div>
            <div className="metrics-grid">
              <div className="metric-card metric-blue">
                <div className="metric-label">Data Size</div>
                <div className="metric-value">{formatBytes(selectedDb.dataSize)}</div>
              </div>
              <div className="metric-card metric-green">
                <div className="metric-label">Storage Size</div>
                <div className="metric-value">{formatBytes(selectedDb.storageSize)}</div>
              </div>
              <div className="metric-card metric-purple">
                <div className="metric-label">Index Size</div>
                <div className="metric-value">{formatBytes(selectedDb.indexSize)}</div>
              </div>
              <div className="metric-card metric-orange">
                <div className="metric-label">Documents</div>
                <div className="metric-value">{selectedDb.objects.toLocaleString()}</div>
              </div>
            </div>
            
            <div className="database-size-section">
              <div className="size-info">Database Size: {formatBytes(selectedDb.totalSize)}</div>
              <div className="size-progress">
                <div 
                  className="size-fill"
                  style={{ 
                    width: instance.totalSize > 0 ? `${(selectedDb.totalSize / instance.totalSize) * 100}%` : '10%',
                    minWidth: '10%' 
                  }}
                >
                  {((selectedDb.totalSize / instance.totalSize) * 100).toFixed(1)}%
                </div>
              </div>
              <div className="size-note">
                {selectedDb.totalSize > 0 ? `${((selectedDb.totalSize / instance.totalSize) * 100).toFixed(2)}% of total instance` : 'No data'}
              </div>
            </div>
          </div>

          {/* Collections Details */}
          {selectedDb.collectionsDetail.length > 0 && (
            <div className="settings-card">
              <div className="section-header">
                <FileText className="section-icon" />
                <h3 className="section-title">Collections in {selectedDb.name}</h3>
              </div>
              <div className="collections-table">
                <table>
                  <thead>
                    <tr>
                      <th>Collection</th>
                      <th>Documents</th>
                      <th>Data Size</th>
                      <th>Storage Size</th>
                      <th>Indexes</th>
                      <th>Index Size</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedDb.collectionsDetail.map((collection, index) => (
                      <tr key={collection.name} className={index % 2 === 0 ? 'row-even' : 'row-odd'}>
                        <td className="collection-name">{collection.name}</td>
                        <td>{collection.documents.toLocaleString()}</td>
                        <td>{formatBytes(collection.size)}</td>
                        <td>{formatBytes(collection.storageSize)}</td>
                        <td>{collection.indexes}</td>
                        <td>{formatBytes(collection.indexSize)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {selectedDb.error && (
            <div className="alert alert-danger">
              <h4 className="alert-title">Error accessing database</h4>
              <p className="alert-message">{selectedDb.error}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default SystemSettings;