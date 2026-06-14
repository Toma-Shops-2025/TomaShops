
CREATE POLICY "Public can read products bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'products');

CREATE POLICY "Authenticated users can upload to products bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'products');

CREATE POLICY "Authenticated users can update their own files in products bucket"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'products' AND owner = auth.uid())
WITH CHECK (bucket_id = 'products' AND owner = auth.uid());

CREATE POLICY "Authenticated users can delete their own files in products bucket"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'products' AND owner = auth.uid());
