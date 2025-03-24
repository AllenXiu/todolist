import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  TextField, 
  MenuItem, 
  Grid,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
  Alert
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Todo, Status } from '../types/todo';
import TodoItem from './TodoItem';
import { getTodos, deleteTodo, updateTodo } from '../services/todoService';
import { getStatusText, getPriorityText } from '../utils/todoUtils';

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const navigate = useNavigate();

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const data = await getTodos();
      setTodos(data);
      setError(null);
    } catch (err: any) {
      if (err.message === '未登录或会话已过期') {
        setError('请先登录以查看您的待办事项');
      } else if (err.response?.status === 401) {
        setError('您的登录已过期，请重新登录');
      } else {
        setError('获取待办事项失败，请稍后重试');
      }
      console.error('获取待办事项错误:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleEdit = (id: string) => {
    navigate(`/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('确定要删除这个待办事项吗？')) {
      try {
        await deleteTodo(id);
        setTodos(todos.filter(todo => todo.id !== id));
      } catch (err) {
        setError('删除待办事项失败，请稍后重试');
        console.error('删除待办事项错误:', err);
      }
    }
  };

  const handleView = (id: string) => {
    navigate(`/view/${id}`);
  };

  const handleAddNew = () => {
    navigate('/create');
  };

  const handleToggleStatus = async (id: string, currentStatus: Status) => {
    try {
      // 确定下一个状态
      let nextStatus: Status;
      switch(currentStatus) {
        case 'not_started':
          nextStatus = 'in_progress';
          break;
        case 'in_progress':
          nextStatus = 'completed';
          break;
        case 'completed':
          nextStatus = 'not_started';
          break;
        default:
          nextStatus = 'not_started';
      }
      
      // 更新待办事项状态
      const updatedTodo = await updateTodo(id, { status: nextStatus });
      
      // 更新本地状态
      setTodos(todos.map(todo => 
        todo.id === id ? updatedTodo : todo
      ));
    } catch (err) {
      setError('更新待办事项状态失败，请稍后重试');
      console.error('更新待办事项状态错误:', err);
    }
  };

  // 获取所有不重复的分类
  const allCategories = Array.from(new Set(todos.map(todo => todo.category)));

  // 筛选待办事项
  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          todo.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || todo.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || todo.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'all' || todo.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          我的待办事项
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={handleAddNew}
        >
          添加新待办
        </Button>
      </Box>

      <Box mb={3}>
        <TextField
          fullWidth
          variant="outlined"
          label="搜索待办事项"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
        />
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel id="status-filter-label">状态</InputLabel>
              <Select
                labelId="status-filter-label"
                id="status-filter"
                value={statusFilter}
                label="状态"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">全部状态</MenuItem>
                <MenuItem value="not_started">{getStatusText('not_started')}</MenuItem>
                <MenuItem value="in_progress">{getStatusText('in_progress')}</MenuItem>
                <MenuItem value="completed">{getStatusText('completed')}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel id="priority-filter-label">优先级</InputLabel>
              <Select
                labelId="priority-filter-label"
                id="priority-filter"
                value={priorityFilter}
                label="优先级"
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <MenuItem value="all">全部优先级</MenuItem>
                <MenuItem value="low">{getPriorityText('low')}</MenuItem>
                <MenuItem value="medium">{getPriorityText('medium')}</MenuItem>
                <MenuItem value="high">{getPriorityText('high')}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel id="category-filter-label">分类</InputLabel>
              <Select
                labelId="category-filter-label"
                id="category-filter"
                value={categoryFilter}
                label="分类"
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <MenuItem value="all">全部分类</MenuItem>
                {allCategories.map(category => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : filteredTodos.length > 0 ? (
        <Box>
          {filteredTodos.map(todo => (
            <TodoItem 
              key={todo.id} 
              todo={todo} 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
              onToggleStatus={handleToggleStatus}
              onClick={handleView} 
            />
          ))}
        </Box>
      ) : (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="textSecondary">
            没有找到符合条件的待办事项
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default TodoList; 