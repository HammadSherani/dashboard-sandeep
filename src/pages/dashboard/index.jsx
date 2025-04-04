import React, { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import GroupChart1 from "@/components/partials/widget/chart/group-chart-1";
import RevenueBarChart from "@/components/partials/widget/chart/revenue-bar-chart";
import RadialsChart from "@/components/partials/widget/chart/radials";
import SelectMonth from "@/components/partials/SelectMonth";
import CompanyTable from "@/components/partials/Table/company-table";
import RecentActivity from "@/components/partials/widget/recent-activity";
import HomeBredCurbs from "../../components/shared/HomeBredCurbs";
import axiosInstance from "../../configs/axios.config";
import { handleError } from "../../utils/functions";

const Dashboard = () => {
  const [date, setDate] = useState()
  const [data, setData] = useState([])
  const [details, setDetails] = useState([])


  useEffect(() => {
    const controller = new AbortController();
    const getData = async () => {
      try {
        const { data } = await axiosInstance.get(`/admin/dashboard`, { signal: controller.signal });
        setData(data.data);
      } catch (error) {
        handleError(error);
      } finally {

      }
    };
    getData();

    return () => {
      controller.abort();
    };
  }, []);

  // This route provide the details of the dashboard users and admins

  useEffect(() => {
    const controller = new AbortController();
    const getData = async () => {
      try {
        const { data } = await axiosInstance.get(`/admin/dashboard/details`, { signal: controller.signal });
        setDetails(data.data);
      } catch (error) {
        handleError(error);
      } finally {

      }
    };
    getData();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <div>
      <HomeBredCurbs title="Dashboard" setDate={setDate} />
      <div className="mb-4">

        <Card bodyClass="p-4">
          <div className="grid md:grid-cols-4 col-span-1 gap-4">
            <GroupChart1 users={data?.users || 0} admins={data?.admins || 0} addresses={data?.addresses || 0} riders={data?.riders || 0} />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-12 gap-5">
        <div className="lg:col-span-8 col-span-12">
          <Card>
            <div className="legend-ring">
              <RevenueBarChart bookings={data?.bookings} pickups={data?.pickups} addresses={data?.addresses} />
            </div>
          </Card>
        </div>
        <div className="lg:col-span-4 col-span-12">
          <Card title="Overview" headerslot={<SelectMonth />}>
            <RadialsChart />
          </Card>
        </div>
        <div className="lg:col-span-8 col-span-12">
          <Card title="All Company" headerslot={<SelectMonth />} noborder>
            <CompanyTable adminDetails={details?.admins} />
          </Card>
        </div>
        <div className="lg:col-span-4 col-span-12">
          <Card title="Recent Activity" headerslot={<SelectMonth />}>
            <RecentActivity userDetails={details.users && details.users} />
          </Card>
        </div>
        {/* <div className="lg:col-span-8 col-span-12">
          <Card
            title="Most Sales"
            headerslot={
              <div className="border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded p-1 flex items-center">
                <span
                  className={` flex-1 text-sm font-normal px-3 py-1 transition-all duration-150 rounded cursor-pointer
                ${filterMap === "global"
                      ? "bg-slate-900 text-white dark:bg-slate-700 dark:text-slate-300"
                      : "dark:text-slate-300"
                    }  
                `}
                  onClick={() => setFilterMap("global")}
                >
                  Global
                </span>
                <span
                  className={` flex-1 text-sm font-normal px-3 py-1 rounded transition-all duration-150 cursor-pointer
                  ${filterMap === "usa"
                      ? "bg-slate-900 text-white dark:bg-slate-700 dark:text-slate-300"
                      : "dark:text-slate-300"
                    }
              `}
                  onClick={() => setFilterMap("usa")}
                >
                  USA
                </span>
              </div>
            }
          >
            <MostSales filterMap={filterMap} />
          </Card>
        </div>
        <div className="lg:col-span-4 col-span-12">
          <Card title="Overview" headerslot={<SelectMonth />}>
            <RadarChart />
            <div className="bg-slate-50 dark:bg-slate-900 rounded p-4 mt-8 flex justify-between flex-wrap">
              <div className="space-y-1">
                <h4 className="text-slate-600 dark:text-slate-200 text-xs font-normal">
                  Invested amount
                </h4>
                <div className="text-sm font-medium text-slate-900 dark:text-white">
                  $8264.35
                </div>
                <div className="text-slate-500 dark:text-slate-300 text-xs font-normal">
                  +0.001.23 (0.2%)
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-slate-600 dark:text-slate-200 text-xs font-normal">
                  Invested amount
                </h4>
                <div className="text-sm font-medium text-slate-900 dark:text-white">
                  $8264.35
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-slate-600 dark:text-slate-200 text-xs font-normal">
                  Invested amount
                </h4>
                <div className="text-sm font-medium text-slate-900 dark:text-white">
                  $8264.35
                </div>
              </div>
            </div>
          </Card>
        </div> */}
      </div>
    </div>
  );
};

export default Dashboard;
