import { Priority, Status } from '../types/todo';

// 获取状态的中文名称
export const getStatusText = (status: Status): string => {
  const statusMap: Record<Status, string> = {
    'not_started': '未开始',
    'in_progress': '进行中',
    'completed': '已完成'
  };
  return statusMap[status] || '未知状态';
};

// 获取优先级的中文名称
export const getPriorityText = (priority: Priority): string => {
  const priorityMap: Record<Priority, string> = {
    'low': '低',
    'medium': '中',
    'high': '高'
  };
  return priorityMap[priority] || '未知优先级';
};

// 获取状态对应的颜色
export const getStatusColor = (status: Status): string => {
  const colorMap: Record<Status, string> = {
    'not_started': '#9e9e9e', // 灰色
    'in_progress': '#2196f3', // 蓝色
    'completed': '#4caf50'    // 绿色
  };
  return colorMap[status] || '#9e9e9e';
};

// 获取优先级对应的颜色
export const getPriorityColor = (priority: Priority): string => {
  const colorMap: Record<Priority, string> = {
    'low': '#8bc34a',    // 浅绿色
    'medium': '#ff9800', // 橙色
    'high': '#f44336'    // 红色
  };
  return colorMap[priority] || '#9e9e9e';
};

// 格式化日期显示
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}; 