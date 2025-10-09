-- Mise à jour de l'URL Hearthis avec l'URL simplifiée (Option 2)
UPDATE mix_sessions
SET 
  embed_url = 'https://app.hearthis.at/embed/12807924/',
  updated_at = now()
WHERE id = '2a1007cc-1bd4-49a8-be23-8249151990e3';