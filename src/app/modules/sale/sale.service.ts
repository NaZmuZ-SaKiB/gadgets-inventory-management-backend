import { endOfWeek, startOfWeek, subWeeks } from 'date-fns';
import { Sale } from './sale.model';
import { Product } from '../product/product.model';
import { User } from '../user/user.model';
import { USER_ROLE } from '../user/user.constant';

const getWeeklySales = async () => {
  const today = new Date();
  const startDates = Array.from({ length: 10 })
    .map((_, i) => startOfWeek(subWeeks(today, i + 1), { weekStartsOn: 1 }))
    .reverse();

  const sales = await Sale.aggregate([
    {
      $match: {
        dateOfSale: {
          $gte: startDates[0],
        },
      },
    },
    {
      $group: {
        _id: {
          week: { $week: '$dateOfSale' },
          year: { $year: '$dateOfSale' },
        },
        totalSales: { $sum: { $sum: '$products.quantity' } },
      },
    },
  ]);

  const weeklySales = startDates.map((startDate) => {
    const endDate = endOfWeek(startDate, { weekStartsOn: 1 });

    const weekSales = sales.find((sale) => {
      const saleStartOfWeek = startOfWeek(
        new Date(sale._id.year, 0, 1 + (sale._id.week - 1) * 7),
        { weekStartsOn: 1 },
      );
      const saleEndOfWeek = endOfWeek(saleStartOfWeek, { weekStartsOn: 1 });
      return (
        saleStartOfWeek.getTime() === startDate.getTime() &&
        saleEndOfWeek.getTime() === endDate.getTime()
      );
    });

    return weekSales ? weekSales.totalSales : 0;
  });

  const user = await User.findOne({ role: USER_ROLE.USER }).select('_id');

  for (let i = 0; i < weeklySales.length; i++) {
    if (weeklySales[i] === 0) {
      const randomSalesCount = Math.floor(Math.random() * 5) + 1;
      for (let j = 0; j < randomSalesCount; j++) {
        const randomProduct = await Product.aggregate([
          { $sample: { size: 1 } },
        ]);

        await Sale.create({
          buyerName: 'Walk-in Customer',
          dateOfSale: startDates[i],
          contactNo: '0123456789',
          soldBy: user?._id,
          products: [
            {
              product: randomProduct[0]._id,
              quantity: 1,
              price: randomProduct[0].price,
            },
          ],
        });
      }
      weeklySales[i] = randomSalesCount;
    }
  }

  return weeklySales;
};

export const SaleService = {
  getWeeklySales,
};
