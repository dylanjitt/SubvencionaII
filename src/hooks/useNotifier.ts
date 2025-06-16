import { sendNotification, sendNotifications } from "../services/notificationService"
import { useAuthStore } from "../store/authStore"

export const useNotifier = () => {
  const user = useAuthStore((state) => state.user)

  const notificateNewTicket = (adminId: string, gasStationId: string, gasStationName: string, gasType: string) => {
    sendNotification({
      userId: adminId,
      gasStationId: gasStationId,
      gasStationName: gasStationName,
      message: `${user.firstName} ${user.lastName} solicita reservar ${gasType} `,
      type: "New"
    });
  };

  const notificateConfirmSolicitudeTicket = (userId: string, gasStationId: string, gasStationName: string) => {
    sendNotification({
      userId: userId,
      gasStationId: gasStationId,
      gasStationName: gasStationName,
      message: `Se solicitud confirmación de reserva`,
      type: "Confirm"
    });
  };

  const notificateTicketConfirmation = (adminId: string, gasStationId: string, gasStationName: string, gasType: string) => {
    sendNotification({
      userId: adminId,
      gasStationId: gasStationId,
      gasStationName: gasStationName,
      message: `Se confirma la reservación de ${gasType} para ${user.firstName} ${user.lastName}`,
      type: "Confirmed"
    });
  };

  const notificateCancelByUser = (adminId: string, gasStationId: string, gasStationName: string) => {
    sendNotification({
      userId: adminId,
      gasStationId: gasStationId,
      gasStationName: gasStationName,
      message: `${user.firstName} ${user.lastName} cancelo la reserva`,
      type: "Cancel"
    });
  };

  const notificateCancelByGasStation = (userId: string, gasStationId: string, gasStationName: string) => {
    sendNotification({
      userId: userId,
      gasStationId: gasStationId,
      gasStationName: gasStationName,
      message: `Se cancelo su reserva para la gasolinera ${gasStationName}`,
      type: "Cancel"
    });
  };

  const notificateNextTicket = (userId: string, gasStationId: string, gasStationName: string) => {
    sendNotification({
      userId: userId,
      gasStationId: gasStationId,
      gasStationName: gasStationName,
      message: `Su Ticket sera el siguiente en ser Atentido`,
      type: "Next"
    });
  };

  const notificateFinishedService = (userId: string, gasStationId: string, gasStationName: string) => {
    sendNotification({
      userId: userId,
      gasStationId: gasStationId,
      gasStationName: gasStationName,
      message: `Se cumplio con el servicio de reserva en la gasolinera ${gasStationName}`,
      type: "Finished"
    });
  }

  const notificateStock = (
    adminId: string,
    gasStationId: string,
    gasStationName: string,
    gasType: string,
    stock: number,
    recipientPhone: string
  ) => {
    const msg = `La gasolinera ${gasStationName} tiene ${stock} litros en ${gasType}`;
    const encodedMsg = encodeURIComponent(msg);
    const phone = recipientPhone.replace(/\D/g, ''); // solo dígitos
    const waLink = `https://wa.me/${phone}?text=${encodedMsg}`;

    sendNotifications({
      gasStationId: gasStationId,
      gasStationName: gasStationName,
      message: `La gasolinera ${gasStationName} tiene ${stock} litros en ${gasType}`,
      type: "Stock"
    })

    sendNotification({
      userId: adminId,
      gasStationId: gasStationId,
      gasStationName: gasStationName,
      message: `La gasolinera ${gasStationName} tiene ${stock} litros en ${gasType}`,
      type: "Stock"
    });

    return waLink
  };


  // TODO: Eliminar Simulación
  const simHappyPath = (adminId: string, gasStationId: string, gasStationName: string, gasType: string) => {
    notificateNewTicket(adminId, gasStationId, gasStationName, gasType)

    setTimeout(() => {
      notificateConfirmSolicitudeTicket(user.id, gasStationId, gasStationName)
      setTimeout(() => {
        notificateTicketConfirmation(adminId, gasStationId, gasStationName, gasType)
        setTimeout(() => {
          notificateNextTicket(user.id, gasStationId, gasStationName)
          setTimeout(() => {
            notificateFinishedService(user.id, gasStationId, gasStationName)
          }, 5000);

        }, 5000);

      }, 5000);

    }, 5000);
  }

  const simTicketCancelByAdmin = (adminId: string, gasStationId: string, gasStationName: string, gasType: string) => {
    notificateNewTicket(adminId, gasStationId, gasStationName, gasType)

    setTimeout(() => {
      notificateConfirmSolicitudeTicket(user.id, gasStationId, gasStationName)
      setTimeout(() => {
        notificateTicketConfirmation(adminId, gasStationId, gasStationName, gasType)
        setTimeout(() => {
          notificateNextTicket(user.id, gasStationId, gasStationName)
          setTimeout(() => {
            notificateCancelByGasStation(user.id, gasStationId, gasStationName)
          }, 5000);

        }, 5000);

      }, 5000);

    }, 5000);
  }

  const simTicketCancelByUser = (adminId: string, gasStationId: string, gasStationName: string, gasType: string) => {
    notificateNewTicket(adminId, gasStationId, gasStationName, gasType)

    setTimeout(() => {
      notificateConfirmSolicitudeTicket(user.id, gasStationId, gasStationName)

      setTimeout(() => {
        notificateCancelByUser(adminId, gasStationId, gasStationName)
      }, 5000);

    }, 5000);
  }

  const simTicketCancelByUserPostConfirmation = (adminId: string, gasStationId: string, gasStationName: string, gasType: string) => {
    notificateNewTicket(adminId, gasStationId, gasStationName, gasType)

    setTimeout(() => {
      notificateConfirmSolicitudeTicket(user.id, gasStationId, gasStationName)
      setTimeout(() => {
        notificateTicketConfirmation(adminId, gasStationId, gasStationName, gasType)
        setTimeout(() => {
          notificateCancelByUser(adminId, gasStationId, gasStationName)
        }, 5000);

      }, 5000);

    }, 5000);
  }


  return {
    notificateNewTicket,
    notificateConfirmSolicitudeTicket,
    notificateTicketConfirmation,
    notificateCancelByUser,
    notificateCancelByGasStation,
    notificateNextTicket,
    notificateFinishedService,
    notificateStock,
    simulation: {
      simHappyPath,
      simTicketCancelByAdmin,
      simTicketCancelByUser,
      simTicketCancelByUserPostConfirmation
    }
  }
}