"use client";

import React, { useCallback, useEffect, useState } from "react";
import { If, Then, Else } from "react-if";

const SalaryCalculator = () => {
  const domTitle = "牛马层级计算器";
  const yearDays = 365;
  useEffect(() => {
    document.title = domTitle;
  }, []);
  const [formData, setFormData] = useState({
    // 月薪
    monthlySalary: 0,
    // 发薪月数
    yearSalaryNum: 12.0,
    // 月休天数
    monthlyFreeDays: 8.0,
    // 年假天数
    annualLeave: 5.0,
    // 法定节假日
    publicHolidays: 13.0,
    // 工作时长
    workHours: 8.0,
    // 通勤时长
    commuteHours: 1.0,
    // 午休时长
    breakHours: 2.0,
    // 工作环境系数
    workEnvironment: "1.0",
    // 异性环境系数
    heterogeneity: "0",
    // 同事环境系数
    teamwork: "0",
    // 上班时间
    workHour: 9.0,
    // 下班时间
    offWorkHour: 18.0,
    // 居住方式
    houseType: "0",
    // 居住环境
    houseEnv: "1.0",
    // 工作城市
    workCity: "hubei",
    // 家庭所在
    homeCity: "0",
  });
  const cityNameOption = [
    { label: "北京", value: "beijing", show: "true" },
    { label: "上海", value: "shanghai", show: "true" },
    { label: "广东", value: "guangdong", show: "true" },
    { label: "江苏", value: "jiangsu", show: "true" },
    { label: "四川", value: "sichuan", show: "true" },
    { label: "湖北", value: "hubei", show: "true" },
    { label: "浙江", value: "zhejiang", show: "true" },
    { label: "陕西", value: "shanxi", show: "true" },
  ];
  const cityMinHourSalaryList = {
    beijing: 26.4,
    shanghai: 24.0,
    jiangsu: 24.0,
    guangdong: 22.2,
    sichuan: 23.0,
    hubei: 22.0,
    zhejiang: 24.0,
    shanxi: 21.0,
  };
  const homeCityOption = [
    { label: "家在本市", value: "1.0", show: "true" },
    { label: "家在省内", value: "0.95", show: "true" },
    { label: "家在省外/国外", value: "0.9", show: "true" },
    { label: "此参数无影响", value: "0", show: "true" },
  ];
  const workEnvironmentOption = [
    { label: "偏僻地区的工厂/工地/户外", value: "0.8", show: "true" },
    { label: "工厂/工地/户外", value: "0.9", show: "true" },
    { label: "普通环境", value: "1.0", show: "true" },
    { label: "CBD/体制内", value: "1.1", show: "true" },
  ];
  const heterogeneityOption = [
    { label: "没有好看的", value: "0.95", show: "true" },
    { label: "好看的不多不少", value: "1.0", show: "true" },
    { label: "很多好看的", value: "1.05", show: "true" },
    { label: "此参数无影响", value: "0", show: "true" },
  ];
  const teamworkOption = [
    { label: "脑残同事较多", value: "0.95", show: "true" },
    { label: "都是普通同事", value: "1.0", show: "true" },
    { label: "优秀同事较多", value: "1.05", show: "true" },
    { label: "此参数无影响", value: "0", show: "true" },
  ];
  const houseTypeOption = [
    { label: "自有住房", value: "1.0", show: "true" },
    { label: "租房", value: "0.9", show: "true" },
    { label: "此参数无影响", value: "0", show: "true" },
  ];
  const houseEnvOption = [
    {
      label: "单间(无独卫)",
      value: "0.9",
      show: formData.houseType == "0.9" ? "true" : "false",
    },
    {
      label: "单间(有独卫)",
      value: "0.95",
      show: formData.houseType == "0.9" ? "true" : "false",
    },
    { label: "一居室", value: "1.0", show: "true" },
    { label: "二居室", value: "1.1", show: "true" },
    { label: "三居室", value: "1.2", show: "true" },
    { label: "大别墅", value: "1.3", show: "true" },
    { label: "此参数无影响", value: "0", show: "true" },
  ];
  // 计算工作天数
  const calculateWorkingDays = useCallback(() => {
    const totalLeaves =
      formData.annualLeave +
      formData.publicHolidays +
      formData.monthlyFreeDays * 12;
    return yearDays - totalLeaves;
  }, [formData.annualLeave, formData.publicHolidays, formData.monthlyFreeDays]);
  // 计算日薪
  const calculateDailySalary = useCallback(() => {
    if (!formData.monthlySalary) return 0;
    const workingDays = calculateWorkingDays();
    return (formData.monthlySalary * formData.yearSalaryNum) / workingDays;
  }, [formData.monthlySalary, formData.yearSalaryNum, calculateWorkingDays]);
  // 计算一天工作时长
  const calculateWorkHours = useCallback(() => {
    if (!formData.workHour || !formData.offWorkHour) return 0;
    return (
      formData.offWorkHour -
      formData.workHour +
      formData.commuteHours -
      formData.breakHours
    );
  }, [
    formData.workHour,
    formData.offWorkHour,
    formData.commuteHours,
    formData.breakHours,
  ]);
  // 工作时长转化的牛马系数
  const getDayWorkHourFactorFun = (workHours: number) => {
    return -0.05 * (workHours - 8) + 1;
  };
  // 通勤时长转化的牛马系数
  const getDayCommuteHourFactorFun = () => {
    const commuteHours = formData.commuteHours;
    return -0.05 * commuteHours + 1;
  };
  const handleInputChange = (name: string, value: string) => {
    if (!value) value = "0";
    setFormData((prev) => ({
      ...prev,
      [name]: parseFloat(value),
    }));
  };
  const handleInputChange2 = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // 计算器
  const calculateValue = () => {
    if (!formData.monthlySalary) return 0;
    // 日薪
    const dailySalary = calculateDailySalary();
    const workHours = calculateWorkHours();
    if (workHours == 0) return 0;
    const getDayWorkHourFactor = getDayWorkHourFactorFun(workHours);
    const getDayCommuteHourFactor = getDayCommuteHourFactorFun();
    // console.log(workHours,getDayCommuteHourFactor);
    // 计算系数
    const environmentFactor =
      (formData.heterogeneity != "0"
        ? parseFloat(formData.heterogeneity)
        : 1.0) *
      parseFloat(formData.workEnvironment) *
      (formData.teamwork != "0" ? parseFloat(formData.teamwork) : 1.0) *
      (formData.houseType != "0" ? parseFloat(formData.houseType) : 1.0) *
      (formData.houseType != "0" && formData.houseEnv != "0"
        ? parseFloat(formData.houseEnv)
        : 1.0) *
      (formData.homeCity != "0" ? parseFloat(formData.homeCity) : 1.0) *
      getDayWorkHourFactor *
      getDayCommuteHourFactor;
    // console.log(environmentFactor);
    return (
      (dailySalary * environmentFactor) /
      ((cityMinHourSalaryList[formData.workCity] + 13) * workHours)
    );
  };

  const value = calculateValue();

  const getValueAssessment = () => {
    if (!formData.monthlySalary)
      return { text: "请输入月薪", color: "text-gray-500" };
    if (value < 0.6) return { text: "底层牛马", color: "text-gray-500" };
    if (value >= 0.6 && value < 0.8)
      return { text: "下级牛马", color: "text-red-500" };
    if (value >= 0.8 && value < 1.0)
      return { text: "普通牛马", color: "text-blue-500" };
    if (value >= 1.0 && value < 1.2)
      return { text: "上级牛马", color: "text-yellow-500" };
    if (value >= 1.2 && value < 1.4)
      return { text: "高级牛马", color: "text-green-500" };
    return { text: "超级牛马", color: "text-purple-500" };
  };

  const RadioGroup = ({
    label,
    name,
    value,
    onChange,
    options,
  }: {
    label: string;
    name: string;
    value: string;
    onChange: (name: string, value: string) => void;
    options: Array<{ label: string; value: string; show: string }>;
  }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="grid grid-cols-4 gap-2">
        {options.map((option) =>
          option.show == null || option.show == "true" ? (
            <button
              key={option.value}
              className={`px-3 py-2 rounded-md text-sm transition-colors
                            ${
                              value === option.value
                                ? "bg-blue-100 text-blue-700 font-medium"
                                : "bg-gray-50 hover:bg-gray-100"
                            }`}
              onClick={() => onChange(name, option.value)}
              type="button"
            >
              {option.label}
            </button>
          ) : (
            ""
          )
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-800">{domTitle}</h1>
      </div>

      <div className="bg-white rounded-xl shadow-xl shadow-gray-200/50">
        <div className="p-6 space-y-8">
          {/* 薪资与工作时间 section */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  月薪（元）
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.monthlySalary}
                  onChange={(e) =>
                    handleInputChange("monthlySalary", e.target.value)
                  }
                  placeholder="月薪"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  每年发薪月数
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  value={formData.yearSalaryNum}
                  onChange={(e) =>
                    handleInputChange("yearSalaryNum", e.target.value)
                  }
                  placeholder="每年发薪月数"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  月休天数
                </label>
                <input
                  min="0"
                  step="0.5"
                  type="number"
                  value={formData.monthlyFreeDays}
                  onChange={(e) =>
                    handleInputChange("monthlyFreeDays", e.target.value)
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  年假天数
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.annualLeave}
                  onChange={(e) =>
                    handleInputChange("annualLeave", e.target.value)
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  法定节假日
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.publicHolidays}
                  onChange={(e) =>
                    handleInputChange("publicHolidays", e.target.value)
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  上班时间
                </label>
                <input
                  type="number"
                  min="1"
                  max="24"
                  step="0.1"
                  value={formData.workHour}
                  onChange={(e) =>
                    handleInputChange("workHour", e.target.value)
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  下班时间
                </label>
                <input
                  type="number"
                  min="1"
                  max="24"
                  step="0.1"
                  value={formData.offWorkHour}
                  onChange={(e) =>
                    handleInputChange("offWorkHour", e.target.value)
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  通勤时长/h
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.commuteHours}
                  onChange={(e) =>
                    handleInputChange("commuteHours", e.target.value)
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  午休时长/h
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.breakHours}
                  onChange={(e) =>
                    handleInputChange("breakHours", e.target.value)
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 my-6"></div>

          {/* 环境系数 */}
          <div className="space-y-4">
            <RadioGroup
              label="工作城市"
              name="workCity"
              value={formData.workCity}
              onChange={handleInputChange2}
              options={cityNameOption}
            />
            <RadioGroup
              label="家庭所在"
              name="homeCity"
              value={formData.homeCity}
              onChange={handleInputChange2}
              options={homeCityOption}
            />
            <RadioGroup
              label="工作环境"
              name="workEnvironment"
              value={formData.workEnvironment}
              onChange={handleInputChange2}
              options={workEnvironmentOption}
            />
            <RadioGroup
              label="异性环境"
              name="heterogeneity"
              value={formData.heterogeneity}
              onChange={handleInputChange2}
              options={heterogeneityOption}
            />

            <RadioGroup
              label="同事环境"
              name="teamwork"
              value={formData.teamwork}
              onChange={handleInputChange2}
              options={teamworkOption}
            />
            <RadioGroup
              label="居住方式"
              name="houseType"
              value={formData.houseType}
              onChange={handleInputChange2}
              options={houseTypeOption}
            />

            <If condition={formData.houseType != "0"}>
              <Then>
                <RadioGroup
                  label="居住环境"
                  name="houseEnv"
                  value={formData.houseEnv}
                  onChange={handleInputChange2}
                  options={houseEnvOption}
                />
              </Then>
              <Else></Else>
            </If>
          </div>
        </div>
      </div>

      {/* 结果卡片优化 */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 shadow-inner">
        <div className="grid grid-cols-3 gap-8">
          <div>
            <div className="text-sm font-medium text-gray-500">年工作天数</div>
            <div className="text-2xl font-semibold mt-1">
              {calculateWorkingDays().valueOf()}天
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500">平均日薪</div>
            <div className="text-2xl font-semibold mt-1">
              ¥{calculateDailySalary().toFixed(2)}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500">牛马评级</div>
            <div
              className={`text-2xl font-semibold mt-1 ${
                getValueAssessment().color
              }`}
            >
              {value.toFixed(3)}
              <span className="text-base ml-2">
                ({getValueAssessment().text})
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryCalculator;
