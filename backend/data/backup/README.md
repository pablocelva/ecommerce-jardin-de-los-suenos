# Respaldo de datos (JSON)

Snapshots estáticos del dataset inicial del bootcamp. **No los usa la aplicación en runtime**; la API lee desde PostgreSQL.

Sirven como referencia para:

- Repoblar la base en entornos locales
- Tests manuales o fixtures
- Documentación del dominio (productos, categorías, usuarios, pedidos)

Si necesitas restaurar datos, importa estos archivos a tu instancia de desarrollo o úsalos como guía al crear seeds de Drizzle.
