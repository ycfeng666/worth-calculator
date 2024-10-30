"use client";

import React, { useState, useCallback } from 'react';
import { Wallet, Clock, Calendar } from 'lucide-react';

const SalaryCalculator = () => {
  const [formData, setFormData] = useState({
    annualSalary: '',         // 年薪
    workDaysPerWeek: 5,       // 每周工作天数
    annualLeave: 5,           // 年假天数
    publicHolidays: 11,       // 法定节假日
    workHours: 8,             // 工作时长
    commuteHours: 1,          // 通勤时长
    breakHours: 1,            // 预备时长
    workEnvironment: '1.0',   // 工作环境系数
    heterogeneity: '1.0',     // 异性环境系数
    teamwork: '1.0',          // 同事环境系数
    education: '1.0'          // 学历系数
  });

  const calculateWorkingDays = useCallback(() => {
    const weeksPerYear = 52;
    const totalWorkDays = weeksPerYear * formData.workDaysPerWeek;
    const totalLeaves = Number(formData.annualLeave) + Number(formData.publicHolidays);
    return totalWorkDays - totalLeaves;
  }, [formData.workDaysPerWeek, formData.annualLeave, formData.publicHolidays]);

  const calculateDailySalary = useCallback(() => {
    if (!formData.annualSalary) return 0;
    const workingDays = calculateWorkingDays();
    return Number(formData.annualSalary) / workingDays;
  }, [formData.annualSalary, calculateWorkingDays]);

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateValue = () => {
    if (!formData.annualSalary) return 0;
    
    const dailySalary = calculateDailySalary();
    const workHours = Number(formData.workHours);
    const commuteHours = Number(formData.commuteHours);
    const breakHours = Number(formData.breakHours);
    
    const environmentFactor = Number(formData.workEnvironment) * 
                            Number(formData.heterogeneity) * 
                            Number(formData.teamwork);
    
    return (dailySalary * environmentFactor) / 
           (35 * (workHours + commuteHours - 0.5 * breakHours) * Number(formData.education));
  };

  const value = calculateValue();
  
  const getValueAssessment = () => {
    if (!formData.annualSalary) return { text: "请输入年薪", color: "text-gray-500" };
    if (value < 0.8) return { text: "很惨", color: "text-red-500" };
    if (value <= 1.5) return { text: "一般", color: "text-yellow-500" };
    if (value <= 2.0) return { text: "很爽", color: "text-green-500" };
    return { text: "爽到爆炸", color: "text-purple-500" };
  };

  const RadioGroup = ({ label, name, value, onChange, options }: {
    label: string;
    name: string;
    value: string;
    onChange: (name: string, value: string) => void;
    options: Array<{ label: string; value: string; }>;
  }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="grid grid-cols-4 gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            className={`px-3 py-2 rounded-md text-sm transition-colors
              ${value === option.value 
                ? 'bg-blue-100 text-blue-700 font-medium' 
                : 'bg-gray-50 hover:bg-gray-100'}`}
            onClick={() => onChange(name, option.value)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-800">
          这b班上得值不值·测算版
        </h1>
        <div className="text-sm text-gray-500">
          拿走工资前，请先算算这班值不值得上
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 space-y-6">
          {/* 薪资与工作时间 */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">年薪（元）</label>
              <div className="flex items-center gap-2 mt-1">
                <Wallet className="w-4 h-4 text-gray-500" />
                <input
                  type="number"
                  value={formData.annualSalary}
                  onChange={(e) => handleInputChange('annualSalary', e.target.value)}
                  placeholder="税前年薪"
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">每周工作天数</label>
                <input
                  type="number"
                  min="1"
                  max="7"
                  value={formData.workDaysPerWeek}
                  onChange={(e) => handleInputChange('workDaysPerWeek', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">年假天数</label>
                <input
                  type="number"
                  value={formData.annualLeave}
                  onChange={(e) => handleInputChange('annualLeave', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">法定节假日</label>
                <input
                  type="number"
                  value={formData.publicHolidays}
                  onChange={(e) => handleInputChange('publicHolidays', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">日工作时长</label>
                <input
                  type="number"
                  value={formData.workHours}
                  onChange={(e) => handleInputChange('workHours', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">通勤时长</label>
                <input
                  type="number"
                  value={formData.commuteHours}
                  onChange={(e) => handleInputChange('commuteHours', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">午休时长</label>
                <input
                  type="number"
                  value={formData.breakHours}
                  onChange={(e) => handleInputChange('breakHours', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 my-6"></div>

          {/* 环境系数 */}
          <div className="space-y-4">
            <RadioGroup
              label="工作环境"
              name="workEnvironment"
              value={formData.workEnvironment}
              onChange={handleInputChange}
              options={[
                { label: '普通环境', value: '1.0' },
                { label: '偏僻地区', value: '0.8' },
                { label: '工厂工地', value: '0.9' },
                { label: 'CBD', value: '1.1' },
              ]}
            />

            <RadioGroup
              label="异性环境"
              name="heterogeneity"
              value={formData.heterogeneity}
              onChange={handleInputChange}
              options={[
                { label: '一般', value: '1.0' },
                { label: '没好看的', value: '0.9' },
                { label: '很多好看的', value: '1.1' },
              ]}
            />

            <RadioGroup
              label="同事环境"
              name="teamwork"
              value={formData.teamwork}
              onChange={handleInputChange}
              options={[
                { label: '普通同事', value: '1.0' },
                { label: '烦人同事多', value: '0.95' },
                { label: '优秀同事多', value: '1.05' },
              ]}
            />

            <RadioGroup
              label="学历要求"
              name="education"
              value={formData.education}
              onChange={handleInputChange}
              options={[
                { label: '专科及以下', value: '0.8' },
                { label: '普通本科', value: '1.0' },
                { label: '211本科', value: '1.2' },
                { label: '普通硕士', value: '1.4' },
                { label: '985硕士', value: '1.6' },
                { label: '普通博士', value: '1.8' },
                { label: '211博士', value: '2.0' },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-50 border rounded-lg p-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-gray-500">年工作天数</div>
            <div className="text-lg font-medium">{calculateWorkingDays()}天</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">平均日薪</div>
            <div className="text-lg font-medium">¥{calculateDailySalary().toFixed(2)}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">工作性价比</div>
            <div className={`text-lg font-medium ${getValueAssessment().color}`}>
              {value.toFixed(2)} ({getValueAssessment().text})
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryCalculator;