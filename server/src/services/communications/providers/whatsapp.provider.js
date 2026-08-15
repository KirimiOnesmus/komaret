// WhatsApp channel — intentionally a seam. Queued WhatsApp notifications will
// FAIL with this clear message (and stay retryable) until a provider is wired.
//
// To enable (Meta WhatsApp Cloud API — the cheapest route in Kenya):
//   POST https://graph.facebook.com/v20.0/<PHONE_NUMBER_ID>/messages
//   Authorization: Bearer <TOKEN>
//   body: { messaging_product:'whatsapp', to, type:'template',
//           template:{ name:<approved_template>, language:{code:'en'}, components:[...] } }
// Return { messageId: <messages[0].id> }.
export async function sendWhatsApp(/* { to, text, templateType, payload } */) {
  throw new Error('WhatsApp provider not configured yet');
}
