import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Select,
  SelectChangeEvent,
  Grid,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import zhCNLocale from 'date-fns/locale/zh-CN';
import { createTodo, updateTodo, getTodoById } from '../services/todoService';
import { CreateTodoDTO } from '../types/todo';
import { getStatusText, getPriorityText } from '../utils/todoUtils';

interface TodoFormProps {
  mode: 'create' | 'edit';
}

const initialFormState: CreateTodoDTO = {
  name: '',
  description: '',
  dueDate: new Date().toISOString(),
  priority: 'medium',
  category: '',
  status: 'not_started'
};

const TodoForm: React.FC<TodoFormProps> = ({ mode }) => {
  const [formData, setFormData] = useState<CreateTodoDTO>(initialFormState);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(mode === 'edit');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // 如果是编辑模式，获取待办事项数据
  useEffect(() => {
    if (mode === 'edit' && id) {
      const fetchTodo = async () => {
        try {
          setFetchLoading(true);
          const todoData = await getTodoById(id);
          setFormData(todoData);
          setError(null);
        } catch (err) {
          setError('获取待办事项失败，请稍后重试');
          console.error('获取待办事项错误:', err);
        } finally {
          setFetchLoading(false);
        }
      };
      
      fetchTodo();
    }
  }, [mode, id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setFormData(prev => ({
        ...prev,
        dueDate: date.toISOString()
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (mode === 'create') {
        await createTodo(formData);
      } else if (mode === 'edit' && id) {
        await updateTodo(id, formData);
      }
      
      navigate('/');
    } catch (err) {
      setError(`${mode === 'create' ? '创建' : '更新'}待办事项失败，请稍后重试`);
      console.error(`${mode === 'create' ? '创建' : '更新'}待办事项错误:`, err);
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {mode === 'create' ? '创建新待办事项' : '编辑待办事项'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="名称"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="描述"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={zhCNLocale}>
                <DatePicker
                  label="截止日期"
                  value={new Date(formData.dueDate)}
                  onChange={handleDateChange}
                  slotProps={{ 
                    textField: { 
                      fullWidth: true,
                      required: true
                    } 
                  }}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel id="priority-label">优先级</InputLabel>
                <Select
                  labelId="priority-label"
                  name="priority"
                  value={formData.priority}
                  label="优先级"
                  onChange={handleSelectChange}
                >
                  <MenuItem value="low">{getPriorityText('low')}</MenuItem>
                  <MenuItem value="medium">{getPriorityText('medium')}</MenuItem>
                  <MenuItem value="high">{getPriorityText('high')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="分类"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel id="status-label">状态</InputLabel>
                <Select
                  labelId="status-label"
                  name="status"
                  value={formData.status}
                  label="状态"
                  onChange={handleSelectChange}
                >
                  <MenuItem value="not_started">{getStatusText('not_started')}</MenuItem>
                  <MenuItem value="in_progress">{getStatusText('in_progress')}</MenuItem>
                  <MenuItem value="completed">{getStatusText('completed')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button 
                variant="outlined" 
                onClick={() => navigate('/')}
              >
                取消
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : mode === 'create' ? '创建' : '更新'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default TodoForm; 