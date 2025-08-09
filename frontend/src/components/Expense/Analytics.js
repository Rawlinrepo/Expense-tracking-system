import React, { useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend, PointElement } from 'chart.js';
import CircularProgressBar from "../ProgressBars/CircularProgressBar";
import LineProgressBar from "../ProgressBars/LineProgressBar";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import './Analytics.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend, PointElement);

const Analytics = ({ transactions }) => {
  const [viewType, setViewType] = useState('monthly');
  const [graphType, setGraphType] = useState('bar');

  const TotalTransactions = transactions.length;

  const totalIncomeTransactions = transactions.filter(item => item.transactionType === "credit");
  const totalExpenseTransactions = transactions.filter(item => item.transactionType === "expense");

  const totalIncomePercent = (totalIncomeTransactions.length / TotalTransactions) * 100;
  const totalExpensePercent = (totalExpenseTransactions.length / TotalTransactions) * 100;

  const totalTurnOver = transactions.reduce((acc, transaction) => acc + (Number(transaction.amount) || 0), 0);
  const totalTurnOverIncome = totalIncomeTransactions.reduce((acc, transaction) => acc + (Number(transaction.amount) || 0), 0);
  const totalTurnOverExpense = totalExpenseTransactions.reduce((acc, transaction) => acc + (Number(transaction.amount) || 0), 0);

  const TurnOverIncomePercent = totalTurnOver > 0 ? (totalTurnOverIncome / totalTurnOver) * 100 : 0;
  const TurnOverExpensePercent = totalTurnOver > 0 ? (totalTurnOverExpense / totalTurnOver) * 100 : 0;

  const categories = [
    "groceries", "rent", "salary", "tip",
    "food", "medical", "utilities", "entertainment",
    "transportation", "other",
  ];

  const colors = {
    "groceries": '#FF6384',
    "rent": '#36A2EB',
    "salary": '#FFCE56',
    "tip": '#4BC0C0',
    "food": '#9966FF',
    "medical": '#FF9F40',
    "utilities": '#8AC926',
    "entertainment": '#6A4C93',
    "transportation": '#1982C4',
    "other": '#F45B69',
  };

  const combineCategories = (type) => {
    return categories.map(category => {
      const total = transactions
        .filter(transaction => transaction.transactionType === type && transaction.category === category)
        .reduce((acc, transaction) => acc + (Number(transaction.amount) || 0), 0);
      return { category, total };
    }).filter(item => item.total > 0);
  };

  const combinedIncomeCategories = combineCategories("credit");
  const combinedExpenseCategories = combineCategories("expense");

  const groupTransactionsByDate = (type) => {
    const data = {};

    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const key = type === 'monthly' ? `${date.getMonth() + 1}/${date.getFullYear()}` : date.getFullYear();

      if (!data[key]) {
        data[key] = { income: 0, expense: 0 };
      }

      if (transaction.transactionType === 'credit') {
        data[key].income += Number(transaction.amount);
      } else {
        data[key].expense += Number(transaction.amount);
      }
    });

    return data;
  };

  const groupedData = groupTransactionsByDate(viewType);

  const labels = Object.keys(groupedData);
  const incomeData = labels.map(label => groupedData[label].income);
  const expenseData = labels.map(label => groupedData[label].expense);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Income",
        data: incomeData,
        backgroundColor: "green",
        borderColor: "green",
        borderWidth: 1,
        fill: false,
      },
      {
        label: "Expense",
        data: expenseData,
        backgroundColor: "red",
        borderColor: "red",
        borderWidth: 1,
        fill: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: `Transactions - ${viewType.charAt(0).toUpperCase() + viewType.slice(1)} Overview` },
    },
  };

  return (
    <div className="analytics-container">
      <div className="card">
        <div className="card-header">Total Transactions: {TotalTransactions}</div>
        <div className="card-body">
          <h5 className="card-title" style={{ color: "green" }}>
            Income: <ArrowDropUpIcon /> {totalIncomeTransactions.length}
          </h5>
          <h5 className="card-title" style={{ color: "red" }}>
            Expense: <ArrowDropDownIcon /> {totalExpenseTransactions.length}
          </h5>
          <div className="progress-bars">
            <CircularProgressBar percentage={totalIncomePercent.toFixed(0)} color="green" />
            <CircularProgressBar percentage={totalExpensePercent.toFixed(0)} color="red" />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">Total TurnOver: {totalTurnOver}</div>
        <div className="card-body">
          <h5 className="card-title" style={{ color: "green" }}>
            Income: <ArrowDropUpIcon /> {totalTurnOverIncome} <CurrencyRupeeIcon />
          </h5>
          <h5 className="card-title" style={{ color: "red" }}>
            Expense: <ArrowDropDownIcon /> {totalTurnOverExpense} <CurrencyRupeeIcon />
          </h5>
          <div className="progress-bars">
            <CircularProgressBar percentage={TurnOverIncomePercent.toFixed(0)} color="green" />
            <CircularProgressBar percentage={TurnOverExpensePercent.toFixed(0)} color="red" />
          </div>
        </div>
      </div>      

      <div className="card">
        <div className="card-header">Categorywise Income</div>
        <div className="card-body">
          {combinedIncomeCategories.map(({ category, total }) => {
            const incomePercent = (total / totalTurnOver) * 100;
            return (
              <LineProgressBar key={category} label={category} percentage={incomePercent.toFixed(0)} lineColor={colors[category]} />
            );
          })}
        </div>
      </div>

      <div className="card">
        <div className="card-header">Categorywise Expense</div>
        <div className="card-body">
          {combinedExpenseCategories.map(({ category, total }) => {
            const expensePercent = (total / totalTurnOver) * 100;
            return (
              <LineProgressBar key={category} label={category} percentage={expensePercent.toFixed(0)} lineColor={colors[category]} />
            );
          })}
        </div>
      </div>
      <div className="card" style={{width:'100%'}}>
      <div className="card-header">Chart</div>
      <div className="view-type-toggle">
      
      </div>
      
      <div className="graph-type-toggle">
       <div className="buttons">
      <div className="view-toggle-buttons mb-3">
        <button onClick={() => setGraphType('bar')} className={graphType === 'bar' ? 'active' : ''}>Bar Graph</button>
        </div>
        <div className="view-toggle-buttons mb-3">
        <button onClick={() => setGraphType('line')} className={graphType === 'line' ? 'active' : ''}>Line Graph</button>
        </div>
        <div className="view-toggle-buttons mb-3">
        <button onClick={() => setViewType('monthly')} className={viewType === 'monthly' ? 'active' : ''}>Monthly</button>
        </div>
        <div className="view-toggle-buttons d-flex justify-content-between mb-3">
        <button onClick={() => setViewType('yearly')} className={viewType === 'yearly' ? 'active' : ''}>Yearly</button>
        </div>
        </div>
      </div>

      <div className="chart-container">
        {graphType === "bar" ? (
          <Bar data={chartData} options={chartOptions} />
        ) : (
          <Line data={chartData} options={chartOptions} />
        )}
      </div>
      </div>
    </div>
  );
};

export default Analytics;
