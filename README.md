# Award Notifications by RabbitMQ Demo

(documentation is WIP)

## Feature Request

System should notify users by email when Award statuses change. Novel route is required to communicate between disparate systems.

Client has existing table (Awards) in db (PostgreSQL).

## Initial Design

![Alerts Workflow Diagram](<docs/img/Demo Awards Alerts 1b.drawio.png>)

## Demonstration setup

This demonstration is utilizing a simplified server set up for the sake of efficiency.

RabbitMQ was established on an AmazonMQ instance to manage the queues for "alerts" and "alerts-sent".

An Ubuntu linux instance on Amazon EC2 operates the remaining servers:

- Database: PostgreSQL - docker
- Backend: Nodejs - docker
- Frontend: Nodejs/Nextjs - docker

![Alerts Implementaiton Workflow Diagram](<docs/img/Docker setup.drawio 1.png>)

1. Award is inserted/updated ("awards" table)
2. MonitorAwards - listens for notification from "awards" table
   1. Test Award:
      1. GREEN LIGHT:
         1. Publish message to "alerts" queue (RabbitMQ)
         2. Inserts new Alert in "alerts" table
      2. RED LIGHT:
         1. Update "inactive_at" Alert in "alerts" table
3. MonitorAlerts - listens for message from "alerts" queue (RabbitMQ)
   1. Test message:
      1. GREEN LIGHT:
         1. Send email to notify employee(s)
         2. Publish message to "alerts-sent" queue
         3. acknowledge message
      2. RED LIGHT:
         1. return
4. MonitorAlertsSent - listens for message from "alerts-sent" queue (RabbitMQ)
   1. Test message:
      1. GREEN LIGHT:
         1. Update "alerts" table field "alert_sent_at"
         2. Acknowledge message
      2. RED LIGHT:
         1. return
5. Alerts Log
   1. initial query of "alerts" table to present to user
   2. listen for notification from "alerts" table
      1. INSERT - prepend Alert in App state
      2. UPDATE - overwrite Alert in App state
