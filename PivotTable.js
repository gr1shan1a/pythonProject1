import React, { useState, useEffect } from 'react';
import MetricSelector from './MetricSelector';
import Filter from './Filter';
import axios from 'axios';  // Импортируем axios для выполнения HTTP-запросов

const PivotTable = () => {
  const [dimensionsRows, setDimensionsRows] = useState([]);
  const [dimensionsCols, setDimensionsCols] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [filters, setFilters] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    // Выполняем запрос данных при загрузке компонента
    const fetchData = async () => {
      try {
        const response = await axios.post('http://localhost:8080/api/v1/report-job/get-metadata', {
          // Предоставьте необходимые данные для запроса
        });
        if (response.status === 200) {
          const responseData = response.data.data;
          // Выполняйте агрегацию или обработку данных по вашим требованиям
          setData(responseData);
        } else {
          console.error('Ошибка при получении данных');
        }
      } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
      }
    };

    fetchData(); // Вызываем функцию запроса данных
  }, []);

  return (
    <div>
      <div>
        <Filter filters={filters} setFilters={setFilters} />
      </div>
      <div>
        <MetricSelector metrics={metrics} setMetrics={setMetrics} />
      </div>
      <div>
        {/* Здесь отображаем сводную таблицу на основе data, dimensionsRows, dimensionsCols и metrics */}
        {/* Пример: */}
        <table>
          <thead>
            <tr>
              {dimensionsCols.map((col) => (
                <th key={col.id}>{col.name}</th>
              ))}
              {metrics.map((metric) => (
                <th key={metric.id}>{metric.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {dimensionsCols.map((col) => (
                  <td key={col.id}>{row[col.name]}</td>
                ))}
                {metrics.map((metric) => (
                  <td key={metric.id}>{row[metric.name]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PivotTable;
