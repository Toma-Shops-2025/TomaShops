DELETE FROM public.messages WHERE conversation_id IN (SELECT id FROM public.conversations WHERE buyer_id = seller_id);
DELETE FROM public.conversations WHERE buyer_id = seller_id;
ALTER TABLE public.conversations ADD CONSTRAINT conversations_buyer_seller_distinct CHECK (buyer_id <> seller_id);