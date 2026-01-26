import { useState } from "react";
import { motion } from "framer-motion";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";

interface AnalyticsChartProps {
	title: string;
	data: { [key: string]: { name: string; nicotine: number; tar: number }[] };
	color: "nicotine" | "tar";
	unit: string;
}

const timeFilters = ["Daily", "Weekly", "Monthly"] as const;

const getCurrentMonthName = () => {
	return new Date().toLocaleString("default", { month: "long" });
};

const AnalyticsChart = ({ title, data, color, unit }: AnalyticsChartProps) => {
	const [timeFilter, setTimeFilter] =
		useState<(typeof timeFilters)[number]>("Daily");

	const colorMap = {
		nicotine: {
			stroke: "hsl(280, 70%, 60%)",
		},
		tar: {
			stroke: "hsl(320, 60%, 55%)",
		},
	};

	// Select the appropriate dataset and map it to the expected Recharts format
	const chartData = (data[timeFilter.toLowerCase()] || []).map((d) => ({
		name: d.name,
		value: color === "nicotine" ? d.nicotine : d.tar,
	}));

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="glass-card rounded-2xl p-6"
		>
			<div className="flex items-center justify-between mb-6">
				<div>
					<h3 className="font-display font-semibold text-foreground">
						{title}
					</h3>
					{timeFilter === "Weekly" && (
						<p className="text-sm text-muted-foreground mt-1">
							{getCurrentMonthName()}
						</p>
					)}
					{timeFilter === "Monthly" && (
						<p className="text-sm text-muted-foreground mt-1">
							Full Year Overview
						</p>
					)}
				</div>
				<div className="flex gap-1 p-1 bg-muted rounded-lg">
					{timeFilters.map((filter) => (
						<button
							key={filter}
							onClick={() => setTimeFilter(filter)}
							className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
								timeFilter === filter
									? "bg-card text-foreground shadow-sm"
									: "text-muted-foreground hover:text-foreground"
							}`}
						>
							{filter}
						</button>
					))}
				</div>
			</div>

			<div className="h-64">
				<ResponsiveContainer width="100%" height="100%">
					<LineChart
						data={chartData}
						margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
					>
						<CartesianGrid
							strokeDasharray="3 3"
							stroke="hsl(270, 20%, 25%)"
							vertical={false}
						/>
						<XAxis
							dataKey="name"
							axisLine={false}
							tickLine={false}
							tick={{
								fill: "hsl(270, 20%, 60%)",
								fontSize: timeFilter === "Monthly" ? 10 : 12,
							}}
							interval={0}
							angle={timeFilter === "Monthly" ? -45 : 0}
							textAnchor={
								timeFilter === "Monthly" ? "end" : "middle"
							}
							height={timeFilter === "Monthly" ? 50 : 30}
						/>
						<YAxis
							axisLine={false}
							tickLine={false}
							tick={{ fill: "hsl(270, 20%, 60%)", fontSize: 12 }}
							tickFormatter={(value) => `${value}${unit}`}
						/>
						<Tooltip
							contentStyle={{
								backgroundColor: "hsl(270, 50%, 10%)",
								border: "1px solid hsl(270, 30%, 25%)",
								borderRadius: "12px",
								boxShadow:
									"0 4px 20px -2px rgba(160, 32, 240, 0.3)",
								color: "hsl(270, 30%, 94%)",
							}}
							formatter={(value: number) => [
								`${value} ${unit}`,
								title,
							]}
							labelStyle={{ color: "hsl(270, 30%, 94%)" }}
						/>
						<Line
							type="linear"
							dataKey="value"
							stroke={colorMap[color].stroke}
							strokeWidth={3}
							dot={{
								fill: colorMap[color].stroke,
								strokeWidth: 0,
								r: 4,
							}}
							activeDot={{ r: 6, fill: colorMap[color].stroke }}
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};

export default AnalyticsChart;
