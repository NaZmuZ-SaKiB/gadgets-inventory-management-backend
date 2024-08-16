import { SaleService } from '../sale/sale.service';

const getDashboardChartsData = async () => {
  const weeklySales = await SaleService.getWeeklySales();

  return {
    weeklySales,
  };
};

export const UserService = {
  getDashboardChartsData,
};
