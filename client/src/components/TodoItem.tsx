import React from 'react';
import { Card, CardContent, Typography, Chip, IconButton, Box, styled } from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Loop as LoopIcon 
} from '@mui/icons-material';
import { Todo, Status } from '../types/todo';
import { 
  getStatusText, 
  getPriorityText, 
  getStatusColor, 
  getPriorityColor,
  formatDate 
} from '../utils/todoUtils';

interface TodoItemProps {
  todo: Todo;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: Status) => void;
  onClick: (id: string) => void;
}

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  cursor: 'pointer',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: theme.shadows[4],
  },
}));

const TodoItem: React.FC<TodoItemProps> = ({ todo, onEdit, onDelete, onToggleStatus, onClick }) => {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(todo.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(todo.id);
  };

  const handleToggleStatus = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleStatus(todo.id, todo.status);
  };

  // 获取下一个状态的文本，用于按钮提示
  const getNextStatusText = (currentStatus: Status) => {
    switch(currentStatus) {
      case 'not_started':
        return '设为进行中';
      case 'in_progress':
        return '设为已完成';
      case 'completed':
        return '设为未开始';
      default:
        return '切换状态';
    }
  };

  return (
    <StyledCard onClick={() => onClick(todo.id)}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Typography variant="h6" component="h2" gutterBottom>
            {todo.name}
          </Typography>

          <Box>
            <IconButton size="small" onClick={handleEdit} aria-label="编辑">
              <EditIcon />
            </IconButton>
            <IconButton 
              size="small" 
              onClick={handleToggleStatus} 
              aria-label={getNextStatusText(todo.status)}
              title={getNextStatusText(todo.status)}
            >
              <LoopIcon />
            </IconButton>
            <IconButton size="small" onClick={handleDelete} aria-label="删除">
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>

        <Typography variant="body2" color="textSecondary" noWrap sx={{ mb: 1 }}>
          {todo.description}
        </Typography>

        <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
          <Chip 
            label={getStatusText(todo.status)} 
            size="small"
            sx={{ bgcolor: getStatusColor(todo.status), color: 'white' }}
          />
          <Chip 
            label={getPriorityText(todo.priority)} 
            size="small"
            sx={{ bgcolor: getPriorityColor(todo.priority), color: 'white' }}
          />
          <Chip 
            label={todo.category} 
            size="small"
            variant="outlined"
          />
        </Box>

        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
          截止日期: {formatDate(todo.dueDate)}
        </Typography>
      </CardContent>
    </StyledCard>
  );
};

export default TodoItem; 