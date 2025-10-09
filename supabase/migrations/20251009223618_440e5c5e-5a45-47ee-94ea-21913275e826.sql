-- Autoriser les admins à insérer des contenus audio
CREATE POLICY "Admins can insert audio content"
ON public.audio_content
FOR INSERT
TO public
WITH CHECK (is_admin());

-- Autoriser les admins à modifier des contenus audio
CREATE POLICY "Admins can update audio content"
ON public.audio_content
FOR UPDATE
TO public
USING (is_admin());

-- Autoriser les admins à supprimer des contenus audio
CREATE POLICY "Admins can delete audio content"
ON public.audio_content
FOR DELETE
TO public
USING (is_admin());