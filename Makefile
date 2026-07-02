install:
	@echo "📦 Installation des dépendances du backend..."
	@npm install --prefix backend
	@echo "✅ Dépendances installées."

start: install
	@echo "🚀 Lancement des conteneurs Docker..."
	@docker-compose up -d --build
	@echo "✅ Application lancée !"
	@echo "👉 Backend : http://localhost:3000"
	@echo "👉 Base de données : localhost:5432"

stop:
	@docker-compose down
	@echo "⏹️ Conteneurs arrêtés."

fclean:
	@docker-compose down --rmi all -v --remove-orphans
	@echo "🧹 Nettoyage des dossiers locaux (node_modules, dist)..."
	@rm -rf backend/node_modules backend/dist
	@rm -rf frontend/node_modules frontend/build frontend/dist 2>/dev/null || true
	@echo "✅ Nettoyage terminé."

re: fclean start

logs:
	@docker-compose logs -f

# === TESTS ===
testB: test-backend

test-backend:
	@echo "🧪 Lancement des tests du backend (Jest)..."
	@npm test --prefix backend
	@echo "✅ Tests terminés."

test-backend-watch:
	@echo "👀 Lancement des tests du backend en mode watch..."
	@npm run test:watch --prefix backend

test-backend-cov:
	@echo "📊 Lancement des tests avec couverture de code..."
	@npm run test:cov --prefix backend

.PHONY: install start stop fclean re logs