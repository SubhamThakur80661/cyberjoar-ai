// Turn an uploaded file into map points.
import Papa from 'papaparse';

export function parseCSV(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const dataPoints = results.data.map((row, i) => ({
          id: `CSV-${Date.now()}-${i}`,
          type: 'HUMINT',
          source: `CSV: ${file.name}`,
          title: row.title || row.name || row.description || `Data point ${i + 1}`,
          lat: parseFloat(row.lat || row.latitude || row.Lat || row.Latitude) || (20 + Math.random() * 15),
          lng: parseFloat(row.lng || row.lon || row.longitude || row.Lng || row.Longitude) || (72 + Math.random() * 12),
          timestamp: row.timestamp || row.date || row.Date || new Date().toISOString(),
          classification: row.classification || 'UNCLASSIFIED',
          confidence: parseInt(row.confidence) || Math.floor(50 + Math.random() * 40),
          details: row.details || row.description || row.notes || 'Uploaded field report data',
          meta: { source: file.name, rows: results.data.length, format: 'CSV' }
        })).filter(p => !isNaN(p.lat) && !isNaN(p.lng));
        
        resolve(dataPoints);
      },
      error: (err) => reject(err)
    });
  });
}

export function parseJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        let data = JSON.parse(e.target.result);
        if (!Array.isArray(data)) data = [data];
        
        const dataPoints = data.map((item, i) => ({
          id: `JSON-${Date.now()}-${i}`,
          type: 'HUMINT',
          source: `JSON: ${file.name}`,
          title: item.title || item.name || `Intel point ${i + 1}`,
          lat: parseFloat(item.lat || item.latitude) || (20 + Math.random() * 15),
          lng: parseFloat(item.lng || item.lon || item.longitude) || (72 + Math.random() * 12),
          timestamp: item.timestamp || item.date || new Date().toISOString(),
          classification: item.classification || 'UNCLASSIFIED',
          confidence: parseInt(item.confidence) || Math.floor(50 + Math.random() * 40),
          details: item.details || item.description || 'Uploaded intelligence package',
          meta: { source: file.name, items: data.length, format: 'JSON' }
        }));
        
        resolve(dataPoints);
      } catch (err) {
        reject(new Error('Invalid JSON format'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

export function parseImage(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataPoint = {
        id: `IMG-UP-${Date.now()}`,
        type: 'IMINT',
        source: `Upload: ${file.name}`,
        title: `Uploaded image: ${file.name}`,
        // Images carry no coordinates here, so place them somewhere in India.
        lat: 20 + Math.random() * 15,
        lng: 72 + Math.random() * 12,
        timestamp: new Date().toISOString(),
        classification: 'UNCLASSIFIED',
        confidence: 70,
        details: `Uploaded image file: ${file.name} (${(file.size / 1024).toFixed(1)} KB). Manual coordinate assignment required for precise positioning.`,
        meta: { 
          fileName: file.name, 
          fileSize: `${(file.size / 1024).toFixed(1)} KB`,
          format: file.type 
        },
        imageUrl: e.target.result
      };
      resolve(dataPoint);
    };
    reader.readAsDataURL(file);
  });
}

export async function parseFile(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  
  if (ext === 'csv') return parseCSV(file);
  if (ext === 'json') return parseJSON(file);
  if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)) {
    const point = await parseImage(file);
    return [point];
  }
  
  throw new Error(`Unsupported file type: .${ext}`);
}
