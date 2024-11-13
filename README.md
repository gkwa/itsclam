# Data Processing Instructions for Storage Usage Chart

## Input Data Format

Raw data dump of storage checks with timestamps in UTC and sizes:

```
1 61.25GB 2024-11-10T05:56:21.8Z
2 61.25GB 2024-11-10T06:45:07.769Z
3 61.25GB 2024-11-10T07:41:36.929Z
...
```

## Data Transformation Steps

1. Filter data to keep only size change events:

   - Sort by timestamp
   - Remove consecutive entries with same size
   - Example: Three entries showing 61.25GB should be reduced to first occurrence only

2. Convert to required format:

```typescript
const data = [
  { timestamp: "2024-11-10T05:56:21.8Z", size: 61.25 },
  { timestamp: "2024-11-10T16:18:06.84Z", size: 66.48 },
]
```

3. Remove trailing GB from size values
4. Keep only first occurrence of each unique size value
5. Ensure timestamps are in ISO format

## Example Transformation

Raw input:

```
1 61.25GB 2024-11-10T05:56:21.8Z
2 61.25GB 2024-11-10T06:45:07.769Z
3 66.48GB 2024-11-10T16:18:06.84Z
4 66.48GB 2024-11-10T16:19:06.84Z
```

Should become:

```typescript
;[
  { timestamp: "2024-11-10T05:56:21.8Z", size: 61.25 },
  { timestamp: "2024-11-10T16:18:06.84Z", size: 66.48 },
]
```

The chart component will handle:

- PST conversion
- Daily usage calculations
- Change indicators
- Visualization

## Usage Notes

- Only provide first occurrence of each unique size
- Keep timestamps in UTC
- Remove any rows that don't represent actual changes in size
