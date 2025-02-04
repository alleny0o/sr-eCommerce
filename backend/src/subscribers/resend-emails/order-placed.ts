import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { INotificationModuleService, IOrderModuleService, OrderDTO } from "@medusajs/framework/types";
import { SubscriberArgs, SubscriberConfig } from "@medusajs/medusa";
import { Templates } from "src/modules/resend/service";

export default async function orderPlacedHandler({
    event: { data },
    container,
}: SubscriberArgs<any>) {
    const orderModuleService: IOrderModuleService = container.resolve(Modules.ORDER);
    const notificationModuleService: INotificationModuleService = container.resolve(Modules.NOTIFICATION);
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);

    const order: OrderDTO = await orderModuleService.retrieveOrder(data.id, {
        relations: ["items"],
    });

    if (!order.email) {
        logger.error("Order does not have an email address");
        return;
    };

    try {
        await notificationModuleService.createNotifications({
            to: order.email,
            channel: "email",
            template: Templates.ORDER_PLACED,
            data: {
                order,
            },
        });
    } catch (error) {
        console.error(`Failed to send order placed email: ${error}`);
    };
};

export const config: SubscriberConfig = {
    event: "order.placed",
};