# Vérification complémentaire — 2026-10-02

- Suppression du mot de passe de fallback, identifiant local admin renommé wearhouse60_admin ; valeur du mot de passe inchangée.
- 7 tests de régression exécutés après ces corrections : tous réussis.
- Stripe Price actif : 9999 EUR, tax_behavior inclusive.
- Stripe Checkout réel : WEARHOUSE 60, français, bouton militaire, euro sans conversion automatique. Capture vérifiée.
- Stock final : taille 1 = 17, taille 2 = 17, taille 3 = 16.
- Aucune simulation dans l'application. Le seul événement paid simulé par pytest a été nettoyé (commande ed337da2-25f5-45cd-9e08-3a1768a7e9a8).
- Limite ouverte : formulaire Stripe hébergé non soumis jusqu'à un paiement test réussi. Validation manuelle requise ; pas de preuve e2e paid par carte.