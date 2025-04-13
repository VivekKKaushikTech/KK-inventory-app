import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import { IndianRupee, Boxes } from 'lucide-react';
import skuData from '../data/skuData';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from 'recharts';

const productCategories = Object.keys(skuData);
const locationData = ['Dayabasti', 'Kirtinagar', 'Bhiwadi'];
const colorPalette = [
  '#4F46E5', // Indigo
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#6366F1', // Bright Violet
  '#EC4899', // Pink
  '#22D3EE', // Sky
  '#F97316', // Orange
  '#0EA5E9', // Blue
  '#A3E635', // Lime
];

const generateDummyBarData = () =>
  productCategories.map((cat) => ({
    category: cat,
    quantity: Math.floor(Math.random() * 100 + 10),
  }));

const renderCustomLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  index,
  name,
  value,
}) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill='#333'
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline='central'
      fontSize={10}>
      {`${name}: ${value}`}
    </text>
  );
};

const Dashboard = () => {
  const location = useLocation();
  const inventoryValue = 1250000;
  const inventoryCount = 3472;

  // Get data from state and store in localStorage for persistent header rendering
  useEffect(() => {
    if (location?.state) {
      localStorage.setItem(
        'dashboardUserData',
        JSON.stringify({
          employeeName: location.state.userName,
          employeeID: location.state.employeeID,
          designation: location.state.designation,
          lat: location.state.lat,
          lng: location.state.lng,
          locationName: location.state.locationName,
          employeePhoto: location.state.photo,
        })
      );
    }
  }, [location?.state]);

  const [location1Data] = useState(generateDummyBarData());
  const [location2Data] = useState(generateDummyBarData());

  return (
    <div className='flex flex-col min-h-screen bg-white'>
      <Header title='Inventory Dashboard' />

      {/* Stat Cards */}
      <div className='p-6 grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='bg-blue-50 border-l-4 border-blue-500 p-6 rounded-xl shadow-sm'>
          <p className='text-lg font-semibold text-gray-700'>
            Total Inventory Value
          </p>
          <div className='mt-4 flex items-center gap-2 text-3xl font-bold text-blue-600'>
            <IndianRupee size={28} /> {inventoryValue.toLocaleString()}
          </div>
        </div>
        <div className='bg-green-50 border-l-4 border-green-500 p-6 rounded-xl shadow-sm'>
          <p className='text-lg font-semibold text-gray-700'>
            Total Inventory (nos.)
          </p>
          <div className='mt-4 flex items-center gap-2 text-3xl font-bold text-green-600'>
            <Boxes size={28} /> {inventoryCount.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Pie Charts */}
      <div className='p-6 grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='bg-white p-6 rounded-2xl shadow-md'>
          <h2 className='text-lg font-semibold mb-4'>
            Inventory (nos.) by Location
          </h2>
          <ResponsiveContainer
            width='100%'
            height={300}>
            <PieChart>
              <Pie
                data={locationData.map((loc, i) => ({
                  name: loc,
                  value: 100 + i * 50,
                }))}
                cx='50%'
                cy='50%'
                outerRadius={100}
                innerRadius={60}
                paddingAngle={3}
                dataKey='value'
                label
                labelLine={false}>
                {locationData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colorPalette[index % colorPalette.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className='bg-white p-6 rounded-2xl shadow-md'>
          <h2 className='text-lg font-semibold mb-4'>
            Inventory (nos.) by Category
          </h2>
          <ResponsiveContainer
            width='100%'
            height={300}>
            <PieChart>
              <Pie
                data={productCategories.map((cat, i) => ({
                  name: cat,
                  value: 100 + i * 10,
                }))}
                cx='50%'
                cy='50%'
                outerRadius={100}
                innerRadius={60}
                paddingAngle={3}
                dataKey='value'
                label={renderCustomLabel}
                labelLine={false}>
                {productCategories.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colorPalette[index % colorPalette.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Graphs */}
      <div className='p-6 grid grid-cols-1 gap-6'>
        <div className='bg-white p-6 rounded-2xl shadow-md'>
          <h2 className='text-lg font-semibold mb-4'>Inventory at Dayabasti</h2>
          <ResponsiveContainer
            width='100%'
            height={300}>
            <BarChart
              data={location1Data}
              margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
              <XAxis
                dataKey='category'
                tick={{ fontSize: 10 }}
                interval={0}
                angle={-45}
                textAnchor='end'
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey='quantity'
                fill={colorPalette[3]}
                radius={[4, 4, 0, 0]}>
                <LabelList
                  dataKey='quantity'
                  position='top'
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className='bg-white p-6 rounded-2xl shadow-md'>
          <h2 className='text-lg font-semibold mb-4'>
            Inventory at Kirtinagar
          </h2>
          <ResponsiveContainer
            width='100%'
            height={300}>
            <BarChart
              data={location2Data}
              margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
              <XAxis
                dataKey='category'
                tick={{ fontSize: 10 }}
                interval={0}
                angle={-45}
                textAnchor='end'
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey='quantity'
                fill={colorPalette[8]}
                radius={[4, 4, 0, 0]}>
                <LabelList
                  dataKey='quantity'
                  position='top'
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Footer */}
      <footer className='w-full text-center py-4 px-6 mt-6 bg-white/60 backdrop-blur-md border-t border-orange-100 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] text-sm text-gray-600 font-medium tracking-wide'>
        © {new Date().getFullYear()} Crafted with{' '}
        <span className='text-red-500'>❤</span> by Kanta King Technologies Pvt
        Ltd. All rights reserved.
      </footer>
    </div>
  );
};

export default Dashboard;
