import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Group } from "@visx/group";
import { Bar } from "@visx/shape";
import { scaleBand, scaleLinear } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { Tooltip, useTooltip } from "@visx/tooltip";
import { timeFormat, timeParse } from "d3-time-format";

interface UserHours {
  date: string;
  hours: number;
}

interface User {
  name: string;
  dailies: UserHours[];
}

// Define the props for the component
interface UserChartProps {
  userId: number | null;
}

// Function to fetch the user data from the API
const fetchUser = async (userId: number): Promise<User> => {
  const response = await fetch(`/api/users/${userId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch user hours");
  }
  return response.json();
};

const UserChart: React.FC<UserChartProps> = ({ userId }) => {
  // Use react-query to fetch the user data
  const { data, error, isLoading } = useQuery<User, Error>(
    ["User", userId],
    () => fetchUser(userId!),
    {
      enabled: !!userId, // Only run query if userId is set
    }
  );

  // Helper function to generate the last 30 days
  const getLastNDays = (length = 7, start = new Date()) => {
    const dates = [];

    for (let i = length - 1; i >= 0; i--) {
      const date = new Date(start);
      date.setDate(start.getDate() - i);
      dates.push(date.toISOString().split("T")[0]); // Format as YYYY-MM-DD
    }

    return dates;
  };

  // Process data: fill in missing dates and format dates for display
  const processedData: UserHours[] = useMemo(() => {
    const last7Days = getLastNDays(7);
    const dateMap = new Map(last7Days.map((date) => [date, 0]));

    data?.dailies.forEach(({ date, hours }) => {
      if (dateMap.has(date)) {
        dateMap.set(date, hours);
      }
    });

    return Array.from(dateMap, ([date, hours]) => ({ date, hours }));
  }, [data]);

  // Tooltip setup
  const { showTooltip, hideTooltip, tooltipData, tooltipLeft, tooltipTop } =
    useTooltip<UserHours>();

  // Don't render anything if no userId is provided
  if (!userId) return null;

  // Date parsing and formatting
  const parseDate = timeParse("%Y-%m-%d");
  const formatDate = timeFormat("%b %d");
  const formatStringDate = (date: string) =>
    formatDate(parseDate(date) as Date);

  // Dimensions of the graph
  const width = 800;
  const height = 400;
  const margin = { top: 20, right: 20, bottom: 50, left: 50 };

  // Scales for the graph
  const xScale = scaleBand<string>({
    domain: processedData.map((d) => d.date),
    padding: 0.2,
    range: [margin.left, width - margin.right],
  });

  const yScale = scaleLinear<number>({
    domain: [0, Math.max(...(data?.dailies.map((d) => d.hours) || [0]))],
    range: [height - margin.bottom, margin.top],
  });

  if (!userId) return null; // Hide the component if no userId is set
  if (isLoading) return <div className="text-center py-4">Loading...</div>;
  if (error)
    return (
      <div className="text-red-500 text-center py-4">
        Error: {error.message}
      </div>
    );

  return (
    <div className="mx-auto my-4">
      <h1 className="text-4xl font-bold text-gray-800">{data.name}</h1>
      <svg width={width} height={height}>
        <Group>
          {processedData.map((d) => {
            const barWidth = xScale.bandwidth();
            const barHeight = height - margin.bottom - yScale(d.hours);
            const barX = xScale(d.date);
            const barY = yScale(d.hours);

            return (
              <Bar
                key={`bar-${d.date}`}
                x={barX}
                y={barY}
                width={barWidth}
                height={barHeight}
                fill="steelblue"
                onMouseOver={() => {
                  showTooltip({
                    tooltipData: d,
                    tooltipLeft: barX! + barWidth / 2,
                    tooltipTop: barY,
                  });
                }}
                onMouseOut={hideTooltip}
              />
            );
          })}
        </Group>
        <AxisBottom
          top={height - margin.bottom}
          scale={xScale}
          tickFormat={formatStringDate}
        />
        <AxisLeft left={margin.left} scale={yScale} />
      </svg>
      {tooltipData && (
        <Tooltip top={tooltipTop} left={tooltipLeft}>
          <div>
            <strong>{tooltipData.date}</strong>
            <div>{tooltipData.hours} hours</div>
          </div>
        </Tooltip>
      )}
    </div>
  );
};

export default UserChart;
