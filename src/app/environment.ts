export const isProduction = () => process.env.NODE_ENV === 'production';

export const Environment = {
  NODE_ENV: process.env.NODE_ENV,
  API_PORT: process.env.API_PORT,
  GRAPHIQL_TOKEN: process.env.GRAPHIQL_TOKEN,
  /* RabbitMQ  */
  AMQP_HOST: process.env.AMQP_HOST || 'localhost',
  AMQP_PORT: process.env.AMQP_PORT || 5672,
  AMQP_PASS: process.env.AMQP_PASS || '',
  AMQP_USER: process.env.AMQP_USER || '',
  RABBITMQ_ENABLED: !!process.env.RABBITMQ_ENABLED,
};
