import { describe, it, expect } from 'vitest';
import { ALL_FIXED_STATIONS } from '@/lib/scrapers/blood-stations';

describe('blood-stations data', () => {
  it('should have at least 30 stations across Taiwan', () => {
    expect(ALL_FIXED_STATIONS.length).toBeGreaterThanOrEqual(30);
  });

  it('should include Taipei stations', () => {
    const taipeiStations = ALL_FIXED_STATIONS.filter(
      (s) => s.region === '台北' || s.address.includes('台北')
    );
    expect(taipeiStations.length).toBeGreaterThanOrEqual(5);
  });

  it('should include major blood centers', () => {
    const names = ALL_FIXED_STATIONS.map((s) => s.name);
    expect(names).toContain('台北捐血中心');
    expect(names).toContain('台中捐血中心');
    expect(names).toContain('高雄捐血中心');
    expect(names).toContain('台南捐血中心');
  });

  it('should cover all major regions', () => {
    const regions = new Set(ALL_FIXED_STATIONS.map((s) => s.region).filter(Boolean));
    expect(regions.has('台北')).toBe(true);
    expect(regions.has('新竹')).toBe(true);
    expect(regions.has('台中')).toBe(true);
    expect(regions.has('高雄')).toBe(true);
    expect(regions.has('台南')).toBe(true);
    expect(regions.has('花蓮')).toBe(true);
  });

  it('every station should have name, address, and station_type', () => {
    for (const station of ALL_FIXED_STATIONS) {
      expect(station.name).toBeTruthy();
      expect(station.address).toBeTruthy();
      expect(['fixed_station', 'mobile_bus']).toContain(station.station_type);
    }
  });

  it('every station should have operating_hours', () => {
    for (const station of ALL_FIXED_STATIONS) {
      expect(station.operating_hours).toBeTruthy();
    }
  });

  it('should not have duplicate station names', () => {
    const names = ALL_FIXED_STATIONS.map((s) => s.name);
    const uniqueNames = new Set(names);
    expect(uniqueNames.size).toBe(names.length);
  });
});
