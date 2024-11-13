import React from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts"

type DataPoint = {
  timestamp: string
  size: number
}

type Props = {
  data: DataPoint[]
}

const processData = (rawData: DataPoint[]) => {
  const grouped = new Map<
    string,
    { date: string; Total: number; "Daily Usage": number; change: number | null }
  >()

  rawData.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

  let prevSize = rawData[0].size
  let prevDate = ""

  rawData.forEach((point) => {
    const date = new Date(point.timestamp)
    const pstDate = new Date(date.getTime() - 8 * 60 * 60 * 1000)
    const dateStr = `Nov ${pstDate.getUTCDate()}`

    if (point.size !== prevSize) {
      const usage = point.size - prevSize
      const change = prevDate ? usage - grouped.get(prevDate)?.["Daily Usage"]! : null

      grouped.set(dateStr, {
        date: dateStr,
        Total: point.size,
        "Daily Usage": usage,
        change,
      })

      prevSize = point.size
      prevDate = dateStr
    }
  })

  return Array.from(grouped.values())
}

const DailyStorageChart: React.FC<Props> = ({ data }) => {
  const chartData = processData(data)

  const CustomTotalLabel = (props: any) => {
    const { x, y, value } = props
    return (
      <g>
        <text x={x} y={y - 15} fill="#666" textAnchor="middle">
          {`${value} GB`}
        </text>
      </g>
    )
  }

  const CustomDailyLabel = (props: any) => {
    const { x, y, value, index } = props
    const item = chartData[index]

    return (
      <g>
        <text x={x} y={y - 15} fill="#666" textAnchor="middle">
          {`${value} GB`}
        </text>
        {item.change !== null && (
          <text
            x={x}
            y={y - 30}
            fill={item.change > 0 ? "#ef4444" : "#22c55e"}
            textAnchor="middle"
            fontSize="12"
            fontWeight="bold"
          >
            {`${item.change > 0 ? "↑" : "↓"}${Math.abs(item.change).toFixed(2)} GB`}
          </text>
        )}
      </g>
    )
  }

  return (
    <div className="w-full h-96 p-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 40,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis
            domain={[0, Math.ceil(Math.max(...chartData.map((d) => d.Total)))]}
            tickCount={5}
            label={{ value: "GB", angle: -90, position: "insideLeft" }}
          />
          <Tooltip />
          <Legend />
          <Bar dataKey="Total" fill="#8884d8">
            <LabelList content={<CustomTotalLabel />} />
          </Bar>
          <Bar dataKey="Daily Usage" fill="#82ca9d">
            <LabelList content={<CustomDailyLabel />} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="text-sm text-gray-500 mt-2 text-center">All dates shown in PST (UTC-8)</div>
    </div>
  )
}

export default DailyStorageChart
