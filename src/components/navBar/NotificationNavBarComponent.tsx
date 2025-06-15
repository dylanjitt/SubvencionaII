import {
  ListItem,
  IconButton,
  ListItemAvatar,
  Avatar,
  ListItemText
} from "@mui/material";
import {
  ConfirmationNumber,
  MarkEmailUnread,
  NewReleases,
  EventBusy,
  LocalActivity,
  CheckCircle,
  DomainVerification,
  Delete
} from "@mui/icons-material";

interface NotificacionNavBarProps {
  message: string;
  type: string;
  read: boolean;
  gasSationName: string;
  onArchive?: () => void;
}

const getIconByType = (type: string) => {
  const icons: Record<string, React.ReactNode> = {
    New: <ConfirmationNumber />,
    Confirm: <MarkEmailUnread />,
    Confirmed: <DomainVerification />,
    Cancel: <EventBusy />,
    Next: <LocalActivity />,
    Finished: <CheckCircle />,
    Stock: <NewReleases />
  };

  return icons[type] || <ConfirmationNumber />;
};

const NotificacionNavBarComponent = ({
  message,
  read,
  type,
  gasSationName
}: NotificacionNavBarProps) => {
  return (
    <ListItem
      sx={{
        bgcolor: read ? "background.paper" : "rgba(25, 118, 210, 0.1)",
        borderLeft: read ? "none" : "4px solid #1976d2",
        transition: "background 0.3s ease",
        alignItems: "flex-start"
      }}
      secondaryAction={
        <IconButton edge="end" aria-label="delete">
          <Delete />
        </IconButton>
      }
    >
      <ListItemAvatar>
        <Avatar
          sx={{
            bgcolor: read ? "grey.300" : "primary.main",
            color: read ? "text.primary" : "common.white"
          }}
        >
          {getIconByType(type)}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={message}
        secondary={gasSationName}
      />
    </ListItem>
  );
};

export default NotificacionNavBarComponent;
