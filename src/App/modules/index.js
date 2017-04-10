export default function () {
  return {
    mailer: require('./mailer').default(...arguments),
    chat: require('./chat').default(...arguments),
    offer: require('./offer').default(...arguments),
  };
}
