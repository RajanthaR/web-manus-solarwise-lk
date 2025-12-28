import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL is not set');
  process.exit(1);
}

async function seed() {
  const connection = await mysql.createConnection(DATABASE_URL);

  console.log('🌱 Seeding database...');

  // Seed Hardware Brands
  const brands = [
    { name: 'Growatt', country: 'China', description: 'Leading global inverter manufacturer' },
    { name: 'Huawei', country: 'China', description: 'Premium smart inverter solutions' },
    { name: 'SMA', country: 'Germany', description: 'German engineering excellence' },
    { name: 'Solis', country: 'China', description: 'Cost-effective inverter solutions' },
    { name: 'Fronius', country: 'Austria', description: 'Austrian quality inverters' },
    { name: 'JA Solar', country: 'China', description: 'Top tier solar panel manufacturer' },
    { name: 'Jinko Solar', country: 'China', description: 'World\'s largest solar panel manufacturer' },
    { name: 'LONGi', country: 'China', description: 'Mono PERC technology leader' },
    { name: 'Canadian Solar', country: 'Canada', description: 'Premium quality panels' },
    { name: 'Trina Solar', country: 'China', description: 'Innovative panel technology' },
    { name: 'BYD', country: 'China', description: 'Leading battery technology' },
    { name: 'Pylontech', country: 'China', description: 'LFP battery specialist' },
  ];

  console.log('Adding hardware brands...');
  for (const brand of brands) {
    await connection.execute(
      `INSERT INTO hardware_brands (name, country, description) VALUES (?, ?, ?) 
       ON DUPLICATE KEY UPDATE country=VALUES(country), description=VALUES(description)`,
      [brand.name, brand.country, brand.description]
    );
  }

  // Get brand IDs
  const [brandRows] = await connection.execute('SELECT id, name FROM hardware_brands');
  const brandMap = {};
  for (const row of brandRows) {
    brandMap[row.name] = row.id;
  }

  // Seed Solar Panels
  const panels = [
    {
      brandId: brandMap['JA Solar'],
      model: 'JAM72S30-545/MR',
      wattage: 545,
      efficiency: '21.3',
      cellType: 'Mono PERC',
      warrantyYears: 25,
      degradationAnnual: '0.55',
      output25Years: '84.8',
      qualityScore: '8.5',
      globalRating: '4.5',
      pros: JSON.stringify(['High efficiency', 'Excellent warranty', 'Low degradation']),
      cons: JSON.stringify(['Premium pricing', 'Heavy weight']),
      reviewSummary: 'Excellent performance with industry-leading warranty and low degradation rates.'
    },
    {
      brandId: brandMap['Jinko Solar'],
      model: 'Tiger Neo N-type 580W',
      wattage: 580,
      efficiency: '22.3',
      cellType: 'N-type TOPCon',
      warrantyYears: 25,
      degradationAnnual: '0.40',
      output25Years: '87.4',
      qualityScore: '8.5',
      globalRating: '4.6',
      pros: JSON.stringify(['Highest efficiency', 'N-type technology', 'Excellent low-light performance']),
      cons: JSON.stringify(['Higher cost', 'Newer technology']),
      reviewSummary: 'Premium N-type panels with exceptional efficiency and low degradation.'
    },
    {
      brandId: brandMap['LONGi'],
      model: 'Hi-MO 5 545W',
      wattage: 545,
      efficiency: '21.1',
      cellType: 'Mono PERC',
      warrantyYears: 25,
      degradationAnnual: '0.55',
      output25Years: '84.8',
      qualityScore: '9.0',
      globalRating: '4.7',
      pros: JSON.stringify(['Industry leader', 'Consistent quality', 'Strong warranty']),
      cons: JSON.stringify(['Premium price point']),
      reviewSummary: 'LONGi sets the standard for mono PERC panels with excellent reliability.'
    },
    {
      brandId: brandMap['Canadian Solar'],
      model: 'HiKu6 CS6W-550MS',
      wattage: 550,
      efficiency: '21.2',
      cellType: 'Mono PERC',
      warrantyYears: 25,
      degradationAnnual: '0.55',
      output25Years: '84.8',
      qualityScore: '8.0',
      globalRating: '4.4',
      pros: JSON.stringify(['Good value', 'Reliable brand', 'Wide availability']),
      cons: JSON.stringify(['Average efficiency']),
      reviewSummary: 'Solid performer with good balance of price and quality.'
    },
    {
      brandId: brandMap['Trina Solar'],
      model: 'Vertex S+ 445W',
      wattage: 445,
      efficiency: '21.8',
      cellType: 'N-type',
      warrantyYears: 25,
      degradationAnnual: '0.45',
      output25Years: '86.5',
      qualityScore: '8.5',
      globalRating: '4.5',
      pros: JSON.stringify(['Compact size', 'High efficiency', 'Good for residential']),
      cons: JSON.stringify(['Lower wattage']),
      reviewSummary: 'Perfect for residential installations with space constraints.'
    }
  ];

  console.log('Adding solar panels...');
  for (const panel of panels) {
    await connection.execute(
      `INSERT INTO solar_panels (brandId, model, wattage, efficiency, cellType, warrantyYears, degradationAnnual, output25Years, qualityScore, globalRating, pros, cons, reviewSummary) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE efficiency=VALUES(efficiency), qualityScore=VALUES(qualityScore)`,
      [panel.brandId, panel.model, panel.wattage, panel.efficiency, panel.cellType, panel.warrantyYears, 
       panel.degradationAnnual, panel.output25Years, panel.qualityScore, panel.globalRating, 
       panel.pros, panel.cons, panel.reviewSummary]
    );
  }

  // Seed Inverters
  const inverters = [
    {
      brandId: brandMap['Growatt'],
      model: 'MIN 5000TL-X',
      type: 'string',
      capacity: '5.0',
      efficiency: '97.6',
      phases: 'single',
      mpptTrackers: 2,
      maxDcInput: '7500',
      warrantyYears: 10,
      qualityScore: '7.0',
      globalRating: '4.2',
      features: JSON.stringify(['WiFi monitoring', 'Export limiting', 'Battery ready']),
      pros: JSON.stringify(['Excellent value', 'Good efficiency', 'Easy installation']),
      cons: JSON.stringify(['Fan noise reported', 'Basic monitoring app']),
      reviewSummary: 'Great value inverter with good performance. Some users report fan noise at high loads.'
    },
    {
      brandId: brandMap['Huawei'],
      model: 'SUN2000-5KTL-M1',
      type: 'string',
      capacity: '5.0',
      efficiency: '98.6',
      phases: 'single',
      mpptTrackers: 2,
      maxDcInput: '7500',
      warrantyYears: 10,
      qualityScore: '9.0',
      globalRating: '4.8',
      features: JSON.stringify(['AI-powered MPPT', 'Arc fault detection', 'Smart monitoring']),
      pros: JSON.stringify(['Industry-leading efficiency', 'Excellent monitoring', 'Silent operation']),
      cons: JSON.stringify(['Premium pricing', 'Complex setup']),
      reviewSummary: 'Premium inverter with best-in-class efficiency and smart features.'
    },
    {
      brandId: brandMap['SMA'],
      model: 'Sunny Boy 5.0',
      type: 'string',
      capacity: '5.0',
      efficiency: '97.2',
      phases: 'single',
      mpptTrackers: 2,
      maxDcInput: '9000',
      warrantyYears: 10,
      qualityScore: '9.0',
      globalRating: '4.7',
      features: JSON.stringify(['German engineering', 'Integrated DC disconnect', 'SMA Smart Connected']),
      pros: JSON.stringify(['Exceptional reliability', 'Great support', 'Long track record']),
      cons: JSON.stringify(['Higher cost', 'Larger size']),
      reviewSummary: 'German quality with proven reliability. Industry standard for premium installations.'
    },
    {
      brandId: brandMap['Solis'],
      model: 'S6-GR1P5K',
      type: 'string',
      capacity: '5.0',
      efficiency: '97.3',
      phases: 'single',
      mpptTrackers: 2,
      maxDcInput: '7500',
      warrantyYears: 10,
      qualityScore: '7.5',
      globalRating: '4.3',
      features: JSON.stringify(['Compact design', 'WiFi included', 'Export control']),
      pros: JSON.stringify(['Budget friendly', 'Compact', 'Good efficiency']),
      cons: JSON.stringify(['Basic features', 'Limited support locally']),
      reviewSummary: 'Solid budget option with good performance for the price.'
    },
    {
      brandId: brandMap['Fronius'],
      model: 'Primo 5.0-1',
      type: 'string',
      capacity: '5.0',
      efficiency: '98.1',
      phases: 'single',
      mpptTrackers: 2,
      maxDcInput: '10000',
      warrantyYears: 10,
      qualityScore: '8.5',
      globalRating: '4.6',
      features: JSON.stringify(['SuperFlex design', 'Fronius Solar.web', 'Dynamic Peak Manager']),
      pros: JSON.stringify(['Austrian quality', 'Excellent monitoring', 'Flexible design']),
      cons: JSON.stringify(['Premium pricing']),
      reviewSummary: 'Premium Austrian inverter with excellent build quality and monitoring.'
    },
    {
      brandId: brandMap['Growatt'],
      model: 'SPF 5000ES',
      type: 'hybrid',
      capacity: '5.0',
      efficiency: '93.0',
      phases: 'single',
      mpptTrackers: 2,
      maxDcInput: '6000',
      warrantyYears: 5,
      qualityScore: '6.5',
      globalRating: '4.0',
      features: JSON.stringify(['Off-grid capable', 'Battery charging', 'Generator input']),
      pros: JSON.stringify(['Affordable hybrid', 'Off-grid capable', 'Good for backup']),
      cons: JSON.stringify(['Lower efficiency', 'Shorter warranty']),
      reviewSummary: 'Budget hybrid option for off-grid and backup applications.'
    }
  ];

  console.log('Adding inverters...');
  for (const inverter of inverters) {
    await connection.execute(
      `INSERT INTO inverters (brandId, model, type, capacity, efficiency, phases, mpptTrackers, maxDcInput, warrantyYears, qualityScore, globalRating, features, pros, cons, reviewSummary) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE efficiency=VALUES(efficiency), qualityScore=VALUES(qualityScore)`,
      [inverter.brandId, inverter.model, inverter.type, inverter.capacity, inverter.efficiency, 
       inverter.phases, inverter.mpptTrackers, inverter.maxDcInput, inverter.warrantyYears,
       inverter.qualityScore, inverter.globalRating, inverter.features, inverter.pros, inverter.cons, inverter.reviewSummary]
    );
  }

  // Seed Batteries
  const batteries = [
    {
      brandId: brandMap['BYD'],
      model: 'Battery-Box Premium HVS 5.1',
      type: 'lfp',
      capacityKwh: '5.1',
      voltage: 204,
      cycleLife: 6000,
      depthOfDischarge: '100',
      warrantyYears: 10,
      qualityScore: '9.0',
      globalRating: '4.8',
      pros: JSON.stringify(['Excellent cycle life', 'Modular design', 'High safety']),
      cons: JSON.stringify(['Premium pricing']),
      reviewSummary: 'Industry-leading LFP battery with exceptional safety and longevity.'
    },
    {
      brandId: brandMap['Pylontech'],
      model: 'US3000C',
      type: 'lfp',
      capacityKwh: '3.55',
      voltage: 48,
      cycleLife: 6000,
      depthOfDischarge: '90',
      warrantyYears: 10,
      qualityScore: '8.0',
      globalRating: '4.5',
      pros: JSON.stringify(['Good value', 'Stackable', 'Wide compatibility']),
      cons: JSON.stringify(['48V system only']),
      reviewSummary: 'Popular choice for 48V systems with good balance of price and performance.'
    }
  ];

  console.log('Adding batteries...');
  for (const battery of batteries) {
    await connection.execute(
      `INSERT INTO batteries (brandId, model, type, capacityKwh, voltage, cycleLife, depthOfDischarge, warrantyYears, qualityScore, globalRating, pros, cons, reviewSummary) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE capacityKwh=VALUES(capacityKwh), qualityScore=VALUES(qualityScore)`,
      [battery.brandId, battery.model, battery.type, battery.capacityKwh, battery.voltage,
       battery.cycleLife, battery.depthOfDischarge, battery.warrantyYears, battery.qualityScore,
       battery.globalRating, battery.pros, battery.cons, battery.reviewSummary]
    );
  }

  // Seed Providers
  const providers = [
    {
      name: 'Hayleys Solar',
      nameSinhala: 'හේලිස් සෝලාර්',
      phone: '+94 11 2627000',
      email: 'solar@hayleys.com',
      website: 'https://www.hayleyssolar.com',
      address: 'Colombo, Sri Lanka',
      rating: '4.5',
      description: 'Leading solar solutions provider in Sri Lanka with comprehensive residential and commercial offerings.',
      isActive: true
    },
    {
      name: 'JLanka Technologies',
      nameSinhala: 'ජේලංකා ටෙක්නොලොජීස්',
      phone: '+94 11 2055055',
      email: 'info@jlanka.com',
      website: 'https://www.jlanka.com',
      address: 'Colombo, Sri Lanka',
      rating: '4.3',
      description: 'Established solar provider with wide range of on-grid and off-grid solutions.',
      isActive: true
    },
    {
      name: 'WinSolar',
      nameSinhala: 'වින්සෝලාර්',
      phone: '+94 77 7123456',
      email: 'info@winsolar.lk',
      website: 'https://www.winsolar.lk',
      address: 'Colombo, Sri Lanka',
      rating: '4.2',
      description: 'Competitive solar packages with focus on residential installations.',
      isActive: true
    },
    {
      name: 'Laugfs Solar',
      nameSinhala: 'ලෝගස් සෝලාර්',
      phone: '+94 11 5555555',
      email: 'solar@laugfs.lk',
      website: 'https://www.laugfs.lk',
      address: 'Colombo, Sri Lanka',
      rating: '4.0',
      description: 'Part of Laugfs Group offering integrated energy solutions.',
      isActive: true
    }
  ];

  console.log('Adding providers...');
  for (const provider of providers) {
    await connection.execute(
      `INSERT INTO providers (name, nameSinhala, phone, email, website, address, rating, description, isActive) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE phone=VALUES(phone), rating=VALUES(rating)`,
      [provider.name, provider.nameSinhala, provider.phone, provider.email, provider.website,
       provider.address, provider.rating, provider.description, provider.isActive]
    );
  }

  // Get provider IDs
  const [providerRows] = await connection.execute('SELECT id, name FROM providers');
  const providerMap = {};
  for (const row of providerRows) {
    providerMap[row.name] = row.id;
  }

  // Get panel and inverter IDs
  const [panelRows] = await connection.execute('SELECT id, model FROM solar_panels');
  const panelMap = {};
  for (const row of panelRows) {
    panelMap[row.model] = row.id;
  }

  const [inverterRows] = await connection.execute('SELECT id, model FROM inverters');
  const inverterMap = {};
  for (const row of inverterRows) {
    inverterMap[row.model] = row.id;
  }

  // Seed Packages
  const packages = [
    {
      providerId: providerMap['JLanka Technologies'],
      name: '5kW On-Grid Premium',
      nameSinhala: '5kW On-Grid ප්‍රිමියම්',
      type: 'on-grid',
      systemCapacity: '5.0',
      priceLKR: '698220',
      panelId: panelMap['JAM72S30-545/MR'],
      panelCount: 10,
      inverterId: inverterMap['MIN 5000TL-X'],
      warrantyYears: 10,
      description: 'Complete 5kW on-grid system with JA Solar panels and Growatt inverter.',
      features: JSON.stringify(['Net metering ready', 'WiFi monitoring', '10 year warranty']),
      installationIncluded: true,
      isActive: true
    },
    {
      providerId: providerMap['Hayleys Solar'],
      name: '5kW Premium Huawei',
      nameSinhala: '5kW ප්‍රිමියම් හුආවේ',
      type: 'on-grid',
      systemCapacity: '5.0',
      priceLKR: '850000',
      panelId: panelMap['Hi-MO 5 545W'],
      panelCount: 10,
      inverterId: inverterMap['SUN2000-5KTL-M1'],
      warrantyYears: 10,
      description: 'Premium 5kW system with LONGi panels and Huawei inverter.',
      features: JSON.stringify(['AI-powered optimization', 'Premium monitoring', 'Best efficiency']),
      installationIncluded: true,
      isActive: true
    },
    {
      providerId: providerMap['WinSolar'],
      name: '3kW Budget On-Grid',
      nameSinhala: '3kW බජට් On-Grid',
      type: 'on-grid',
      systemCapacity: '3.0',
      priceLKR: '420000',
      panelId: panelMap['HiKu6 CS6W-550MS'],
      panelCount: 6,
      inverterId: inverterMap['S6-GR1P5K'],
      warrantyYears: 5,
      description: 'Affordable 3kW on-grid system for small households.',
      features: JSON.stringify(['Net metering ready', 'Basic monitoring']),
      installationIncluded: true,
      isActive: true
    },
    {
      providerId: providerMap['Laugfs Solar'],
      name: '5kW Hybrid System',
      nameSinhala: '5kW හයිබ්‍රිඩ් සිස්ටම්',
      type: 'hybrid',
      systemCapacity: '5.0',
      priceLKR: '1250000',
      panelId: panelMap['Tiger Neo N-type 580W'],
      panelCount: 10,
      inverterId: inverterMap['SPF 5000ES'],
      warrantyYears: 5,
      description: '5kW hybrid system with battery backup capability.',
      features: JSON.stringify(['Battery ready', 'Off-grid capable', 'Backup power']),
      installationIncluded: true,
      isActive: true
    },
    {
      providerId: providerMap['JLanka Technologies'],
      name: '10kW Commercial',
      nameSinhala: '10kW වාණිජ',
      type: 'on-grid',
      systemCapacity: '10.0',
      priceLKR: '1350000',
      panelId: panelMap['JAM72S30-545/MR'],
      panelCount: 20,
      inverterId: inverterMap['SUN2000-5KTL-M1'],
      warrantyYears: 10,
      description: 'Commercial grade 10kW system for businesses.',
      features: JSON.stringify(['Commercial grade', 'Remote monitoring', 'High efficiency']),
      installationIncluded: true,
      isActive: true
    },
    {
      providerId: providerMap['Hayleys Solar'],
      name: '3kW Entry Level',
      nameSinhala: '3kW එන්ට්‍රි ලෙවල්',
      type: 'on-grid',
      systemCapacity: '3.0',
      priceLKR: '380000',
      panelId: panelMap['Vertex S+ 445W'],
      panelCount: 7,
      inverterId: inverterMap['MIN 5000TL-X'],
      warrantyYears: 5,
      description: 'Entry level 3kW system for small households.',
      features: JSON.stringify(['Compact design', 'Easy installation']),
      installationIncluded: true,
      isActive: true
    }
  ];

  console.log('Adding packages...');
  for (const pkg of packages) {
    // Calculate hardware quality score
    const [panelScore] = await connection.execute('SELECT qualityScore FROM solar_panels WHERE id = ?', [pkg.panelId]);
    const [inverterScore] = await connection.execute('SELECT qualityScore FROM inverters WHERE id = ?', [pkg.inverterId]);
    
    const pScore = panelScore[0]?.qualityScore || 7;
    const iScore = inverterScore[0]?.qualityScore || 7;
    const hardwareQualityScore = ((parseFloat(pScore) * 0.4) + (parseFloat(iScore) * 0.6)).toFixed(1);

    // Calculate ROI
    const pricePerKw = parseFloat(pkg.priceLKR) / parseFloat(pkg.systemCapacity);
    const annualGeneration = parseFloat(pkg.systemCapacity) * 1560; // kWh per year in Sri Lanka
    const avgTariff = 35; // Average effective tariff
    const annualSavings = annualGeneration * avgTariff;
    const roiYears = (parseFloat(pkg.priceLKR) / annualSavings).toFixed(1);

    await connection.execute(
      `INSERT INTO solar_packages (providerId, name, nameSinhala, type, systemCapacity, priceLKR, panelId, panelCount, inverterId, warrantyYears, description, features, installationIncluded, isActive, hardwareQualityScore, roiYears) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE priceLKR=VALUES(priceLKR), hardwareQualityScore=VALUES(hardwareQualityScore)`,
      [pkg.providerId, pkg.name, pkg.nameSinhala, pkg.type, pkg.systemCapacity, pkg.priceLKR,
       pkg.panelId, pkg.panelCount, pkg.inverterId, pkg.warrantyYears, pkg.description,
       pkg.features, pkg.installationIncluded, pkg.isActive, hardwareQualityScore, roiYears]
    );
  }

  // Seed CEB Tariffs
  const tariffs = [
    { category: 'domestic', blockNumber: 1, minUnits: 0, maxUnits: 60, energyChargeLKR: '11.00', fixedChargeLKR: '0', effectiveFrom: new Date('2025-01-01') },
    { category: 'domestic', blockNumber: 2, minUnits: 61, maxUnits: 90, energyChargeLKR: '14.00', fixedChargeLKR: '400', effectiveFrom: new Date('2025-01-01') },
    { category: 'domestic', blockNumber: 3, minUnits: 91, maxUnits: 120, energyChargeLKR: '25.00', fixedChargeLKR: '1000', effectiveFrom: new Date('2025-01-01') },
    { category: 'domestic', blockNumber: 4, minUnits: 121, maxUnits: 180, energyChargeLKR: '33.00', fixedChargeLKR: '1500', effectiveFrom: new Date('2025-01-01') },
    { category: 'domestic', blockNumber: 5, minUnits: 181, maxUnits: 9999, energyChargeLKR: '52.00', fixedChargeLKR: '2000', effectiveFrom: new Date('2025-01-01') },
  ];

  console.log('Adding CEB tariffs...');
  for (const tariff of tariffs) {
    await connection.execute(
      `INSERT INTO ceb_tariffs (category, blockNumber, minUnits, maxUnits, energyChargeLKR, fixedChargeLKR, effectiveFrom, isActive) 
       VALUES (?, ?, ?, ?, ?, ?, ?, true)
       ON DUPLICATE KEY UPDATE energyChargeLKR=VALUES(energyChargeLKR)`,
      [tariff.category, tariff.blockNumber, tariff.minUnits, tariff.maxUnits, tariff.energyChargeLKR, tariff.fixedChargeLKR, tariff.effectiveFrom]
    );
  }

  console.log('✅ Database seeded successfully!');
  await connection.end();
}

seed().catch(console.error);
