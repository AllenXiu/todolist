import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Button, 
  Grid, 
  Chip,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import { Edit as EditIcon, ArrowBack as ArrowBackIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Todo } from '../types/todo';
import { getTodoById, deleteTodo } from '../services/todoService';
import { 
  getStatusText, 
  getPriorityText, 
  getStatusColor, 
  getPriorityColor,
  formatDate 
} from '../utils/todoUtils';

const TodoDetail: React.FC = () => {
  const [todo, setTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchTodo = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await getTodoById(id);
        setTodo(data);
        setError(null);
      } catch (err) {
        setError('获取待办事项失败，请稍后重试');
        console.error('获取待办事项错误:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTodo();
  }, [id]);

  const handleEdit = () => {
    if (id) {
      navigate(`/edit/${id}`);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    
    if (window.confirm('确定要删除这个待办事项吗？')) {
      try {
        await deleteTodo(id);
        navigate('/');
      } catch (err) {
        setError('删除待办事项失败，请稍后重试');
        console.error('删除待办事项错误:', err);
      }
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Box mt={2}>
          <Button 
            variant="contained" 
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
          >
            返回列表
          </Button>
        </Box>
      </Container>
    );
  }

  if (!todo) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning">找不到该待办事项</Alert>
        <Box mt={2}>
          <Button 
            variant="contained" 
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
          >
            返回列表
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <Button 
          variant="outlined" 
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
        >
          返回列表
        </Button>
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<EditIcon />}
            onClick={handleEdit}
            sx={{ mr: 1 }}
          >
            编辑
          </Button>
          <Button 
            variant="outlined" 
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
          >
            删除
          </Button>
        </Box>
      </Box>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {todo.name}
        </Typography>

        <Box display="flex" flexWrap="wrap" gap={1} my={2}>
          <Chip 
            label={getStatusText(todo.status)} 
            sx={{ bgcolor: getStatusColor(todo.status), color: 'white' }}
          />
          <Chip 
            label={getPriorityText(todo.priority)} 
            sx={{ bgcolor: getPriorityColor(todo.priority), color: 'white' }}
          />
          <Chip 
            label={todo.category} 
            variant="outlined"
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="bold">
              描述
            </Typography>
            <Typography variant="body1" paragraph>
              {todo.description || '没有描述'}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" fontWeight="bold">
              截止日期
            </Typography>
            <Typography variant="body1">
              {formatDate(todo.dueDate)}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" fontWeight="bold">
              创建时间
            </Typography>
            <Typography variant="body1">
              {formatDate(todo.createdAt)}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" fontWeight="bold">
              最后更新
            </Typography>
            <Typography variant="body1">
              {formatDate(todo.updatedAt)}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default TodoDetail; 