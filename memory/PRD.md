# WEARHOUSE 60 — boutique mono-produit

## Objectif original
Landing page inspirée de Maison52, initialement WAX//001, avec React, FastAPI, MongoDB, panier, Stripe Checkout et administration des commandes/stocks. Pas de newsletter.

## Personnalisation approuvée
- Marque WEARHOUSE 60, logo fourni, accent vert militaire foncé.
- Slogan : WEAR IT OR DIE FOR IT.
- Un seul jean noir ciré, 14 oz (~475 g/m²), revers camo, patch gravé à la ceinture.
- Fiche source : https://www.wearsixty.online/product/60-waxed-jean, consultée pendant cette session : 99,99 €, titre WAX//002, 100 % coton.
- Présentation choisie : 60 WAXED JEAN. Prix de comparaison fourni : 110 €.
- Tailles 1/2/3, 50 pièces initiales ; répartition provisoire 17/17/16 approuvée.
- Photos et logo réels fournis, recadrages autorisés ; aucune génération nécessaire.

## Architecture
- React + Tailwind, composants dans frontend/src/components, données éditoriales dans brand.js.
- CartContext : panier persistant ; FastAPI : /api/products, /api/checkout, /api/payments/status/{id}, /api/stripe/webhook, /api/admin/*.
- Catalogue backend/catalog.py : source de vérité pour prix, tailles, références.
- MongoDB : inventory, orders, payment_transactions ; anciens produits non proposés mais historique conservé.
- Stripe sandbox existant, lookup_key wearhouse60_black_camo ; TVA incluse dans le prix, calcul Stripe.
- Assets optimisés dans frontend/public/images ; originaux conservés dans assets/originals.

## Réalisé — 2026-10-02
- Identité WEARHOUSE 60, logo réel détouré/recadré, vert militaire #2b3a26, slogan exact et interface française.
- Hero photo réelle, galerie produit interactive (à plat, face, dos, revers), détails et lookbook sans faux profils.
- Suppression de mock.js, ProductGrid, newsletter, avis fictifs, autres produits et promesses de livraison/retours non fournies.
- Catalogue unique 60 WAXED JEAN : 99,99 € TTC / 110 € barrés ; tailles 1/2/3, stock 17/17/16.
- Initialisation Mongo par $setOnInsert, anciens stocks exclus du catalogue actif sans effacer l'historique.
- Panier persistant wearhouse60_cart_v1, quantités plafonnées, montants calculés en centimes, ancien panier ignoré.
- Administration : 3 lignes, total de stock, sauvegarde explicite, interface mobile française, clé wearhouse60_admin.
- Mot de passe existant inchangé ; ADMIN_PASSWORD obligatoire (suppression du fallback admin). Identifiants documentés dans test_credentials.md.
- Stripe : prix 9999 centimes EUR tax_behavior inclusive, sync exécutée deux fois sans duplication ; checkout français, nom WEARHOUSE 60, bouton vert, adaptive_pricing désactivé.
- Validation serveur SKU/produit/variante/taille ; quantités dupliquées agrégées avant contrôle du stock.
- Seuls les paiements réellement paid sont traités ; garde atomique contre le rejeu du décrément de stock.
- Galerie et autres photos : originaux réels optimisés/recadrés avec Pillow, aucune photo générée ou détail inventé.

## Tests et limites
- Rapport /app/test_reports/iteration_1.json : 11/11 tests backend réussis ; frontend validé à 95 %.
- Build React et compile Python réussis.
- Affichages 1920x800 et 390x844 vérifiés sans débordement ; agent a également mesuré 320/768/1024/1440.
- Galerie, sélection tailles, quantités, persistance panier, annulation, erreur sans session, admin stock et ruptures vérifiés.
- Après correctifs de configuration/admin/branding Stripe : 7 tests de régression additionnels réussis.
- Session Stripe réelle créée, redirection et montant 99,99 € vérifiés ; écran de paiement en français avec WEARHOUSE 60 et bouton vert vérifié.
- IMPORTANT : aucun paiement par carte Stripe mené jusqu'au bout. Automatisation bloquée sur l'accordéon carte hébergé ; ne pas annoncer un achat complet testé.
- Le test webhook signed a simulé un événement paid uniquement pour vérifier la logique de décrément et de rejeu. L'application ne possède pas d'API simulée.
- La commande paid synthétique connue a été supprimée ; stocks rétablis et vérifiés 17/17/16. Des sessions/commandes de test pending subsistent, sans ventes réelles.
- Plusieurs tentatives de test direct Stripe : ne jamais tronquer le hash du checkout_url. Lien tronqué => « This link is incomplete ». Le site transmet bien l'URL entière.
- Formulaire Stripe FR : bouton data-testid card-accordion-item-button, pas le texte « Carte ». Un clic forcé n'a pas dévoilé #cardNumber dans la dernière tentative. RCA agent : problème de stratégie de test du formulaire externe, pas erreur API prouvée. Éviter les boucles coûteuses ; demander un test manuel au propriétaire.

## Assets : correspondance vérifiée visuellement
- Logo : artifact i68ug3t1_Illustration_sans_titre.png (transparent, croix stylisée et signature 60).
- Vue à plat : artifact ip6fp8pj_Capture…copie.png ; ne pas inverser avec le logo malgré l'ordre du listing assets.
- Face : naxsv9um_1.webp ; dos : 61wcsd85_2.webp ; campagne : 2vnun2wk_Sans_titre-1.PNG (bordure rouge supprimée par recadrage).
- Fichiers servis : frontend/public/images/wearhouse60-logo.webp, jean-flat.webp, jean-front.webp, jean-back.webp, campaign.webp, detail-camo.webp, detail-wax.webp, detail-back.webp.

## Prochaines actions prioritaires
- P0 vérification utilisateur : valider le rendu et effectuer un paiement sandbox manuel (4242) jusqu'à la confirmation.
- Aucun bug applicatif connu dans les flows testés ; preuve du paiement carte complet encore manquante.

## À confirmer ultérieurement
- P1 : répartition réelle des 50 pièces et mesures du guide des tailles.
- P1 : modalités d'expédition, retours, contact et mentions légales réelles (aucune promesse inventée).
- P2 : photo de détail du patch et réseaux sociaux officiels.
- P2 : remplacer le stock provisoire par la répartition exacte lorsqu'elle est connue.
- Amélioration conseillée : guide des tailles avec mensurations réelles pour limiter les hésitations et retours.
- Hors périmètre de cette personnalisation : réservations de stock concurrentes, authentification admin renforcée, collecte/politiques de livraison définitives. Ne pas présenter ces sujets comme déjà achevés.