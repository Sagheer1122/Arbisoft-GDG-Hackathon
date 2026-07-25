import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { StatCard } from '../components/ui/StatCard';
import { BarChart3, Download, FileSpreadsheet, Users, Clock, Moon, Shield } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { api } from '../services/api';
import jsPDF from 'jspdf';

export const DutyReportPage: React.FC = () => {
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [reportsData, setReportsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const data = await api.getReports();
        setReportsData(data);
      } catch (err) {
        console.error('Error fetching duty reports:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const summary = reportsData?.summary || {
    totalNurses: 25,
    totalDutyHours: 1200,
    overtimeHours: 150,
    nightShifts: 300,
  };

  const chartData = reportsData?.departmentBreakdown || [
    { department: 'General Ward', hours: 800 },
    { department: 'ICU', hours: 250 },
    { department: 'Emergency', hours: 150 },
    { department: 'Pediatrics', hours: 100 },
  ];

  const COLORS = ['#5142C5', '#39B879', '#F6B728', '#EF5350'];

  // Export CSV
  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Department,Duty Hours\n';
    chartData.forEach((row: any) => {
      csvContent += `${row.department},${row.hours}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NurseFlow_Duty_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(81, 66, 197); // #5142C5
    doc.text('NurseFlow — Duty & Overtime Report', 14, 22);

    doc.setFontSize(10);
    doc.setTextColor(112, 112, 128);
    doc.text(`Generated Date: ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`Hospital Summary Metric Report`, 14, 36);

    doc.setLineWidth(0.5);
    doc.setDrawColor(231, 231, 240);
    doc.line(14, 42, 196, 42);

    doc.setFontSize(12);
    doc.setTextColor(22, 22, 42);
    doc.text(`Summary Metrics:`, 14, 52);
    doc.setFontSize(10);
    doc.text(`• Total Active Nurses: ${summary.totalNurses}`, 18, 60);
    doc.text(`• Total Duty Hours: ${summary.totalDutyHours} hrs`, 18, 68);
    doc.text(`• Overtime Hours Logged: ${summary.overtimeHours} hrs`, 18, 76);
    doc.text(`• Night Shifts Completed: ${summary.nightShifts}`, 18, 84);

    doc.setFontSize(12);
    doc.text(`Department Duty Hours Breakdown:`, 14, 98);
    let y = 108;
    chartData.forEach((row: any) => {
      doc.setFontSize(10);
      doc.text(`${row.department}: ${row.hours} hours`, 18, y);
      y += 8;
    });

    doc.save(`NurseFlow_Duty_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#16162A]">Duty & Overtime Reports</h1>
          <p className="text-xs text-[#707080] font-medium mt-0.5">
            Analytical insights into hospital duty hours, overtime, and department allocations
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            icon={<FileSpreadsheet size={16} />}
            className="font-bold"
          >
            Export CSV
          </Button>
          <Button
            size="sm"
            onClick={handleExportPDF}
            icon={<Download size={16} />}
            className="font-bold"
          >
            Export PDF
          </Button>
        </div>
      </div>

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Nurses"
          value={summary.totalNurses}
          description="Active Roster Staff"
          icon={<Users size={24} />}
          color="purple"
        />
        <StatCard
          title="Total Duty Hours"
          value={`${summary.totalDutyHours} hrs`}
          description="Cumulative Ward Hours"
          icon={<Clock size={24} />}
          color="green"
        />
        <StatCard
          title="Overtime Hours"
          value={`${summary.overtimeHours} hrs`}
          description="Beyond Standard Shift"
          icon={<BarChart3 size={24} />}
          color="amber"
        />
        <StatCard
          title="Night Shifts"
          value={summary.nightShifts}
          description="Completed Night Rotations"
          icon={<Moon size={24} />}
          color="blue"
        />
      </div>

      {/* Filter Toolbar */}
      <Card className="p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-xs font-bold text-[#707080] uppercase">Department Filter:</span>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="bg-[#F7F7FB] border border-[#E7E7F0] rounded-button px-3 py-1.5 text-xs text-[#16162A] font-semibold focus:outline-none"
          >
            <option value="ALL">All Departments</option>
            <option value="General Ward">General Ward</option>
            <option value="ICU">ICU</option>
            <option value="Emergency">Emergency</option>
            <option value="Pediatrics">Pediatrics</option>
          </select>
        </div>
        <span className="text-xs text-[#707080] font-medium">Reporting Period: May 2025</span>
      </Card>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Bar Chart: Duty Hours by Department */}
        <Card className="p-6 space-y-4">
          <h3 className="text-sm font-extrabold text-[#16162A]">Duty Hours by Department</h3>
          <p className="text-xs text-[#707080]">Distribution of total logged work hours</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E7E7F0" />
                <XAxis dataKey="department" stroke="#707080" fontSize={11} />
                <YAxis stroke="#707080" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#16162A',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="hours" fill="#5142C5" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Pie Chart: Department Allocation Percentage */}
        <Card className="p-6 space-y-4">
          <h3 className="text-sm font-extrabold text-[#16162A]">Department Allocation Breakdown</h3>
          <p className="text-xs text-[#707080]">Percentage share of total hospital duty hours</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="hours"
                  nameKey="department"
                >
                  {chartData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#707080' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};
