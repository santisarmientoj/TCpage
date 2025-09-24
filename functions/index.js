const functions = require("firebase-functions");
const admin = require("firebase-admin");
const stripe = require("stripe")(functions.config().stripe.secret); // tu API Secret Key
admin.initializeApp();

exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
  let event;

  try {
    const sig = req.headers["stripe-signature"];
    event = stripe.webhooks.constructEvent(req.rawBody, sig, functions.config().stripe.webhook_secret);
  } catch (err) {
    console.error("⚠️ Error verificando webhook:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Procesar el evento de suscripción completada
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const customerEmail = session.customer_email;

    // Buscar el usuario en Firestore por email
    const usersRef = admin.firestore().collection("users");
    const snapshot = await usersRef.where("email", "==", customerEmail).get();

    if (!snapshot.empty) {
      snapshot.forEach(doc => {
        usersRef.doc(doc.id).update({
          subscription: "active",
          plan: "premium",
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      });
    }
  }

  res.json({received: true});
});
