import { supabaseAdmin } from '../../config/supabase.js';

// GET /api/categories-reclamation
export const getCategories = async (req, res) => {
  try {
    const { data: cats, error: errCats } = await supabaseAdmin
      .from('categories_reclamation')
      .select('*')
      .eq('actif', true)
      .order('ordre');

    if (errCats) throw errCats;

    const { data: types, error: errTypes } = await supabaseAdmin
      .from('types_reclamation')
      .select('*')
      .eq('actif', true)
      .order('categorie_id')
      .order('groupe_titre')
      .order('ordre');

    if (errTypes) throw errTypes;

    // Regrouper les types par catégorie puis par groupe_titre
    const result = cats.map(cat => {
      const catTypes = types.filter(t => t.categorie_id === cat.id);

      const groupsMap = {};
      catTypes.forEach(t => {
        if (!groupsMap[t.groupe_titre]) groupsMap[t.groupe_titre] = [];
        groupsMap[t.groupe_titre].push(t.item_label);
      });

      const groups = Object.entries(groupsMap).map(([title, items]) => ({ title, items }));

      return {
        id:      cat.id,
        label:   cat.label,
        desc:    cat.description,
        bg:      cat.bg_color,
        iconKey: cat.icon_key,
        groups,
      };
    });

    res.json(result);
  } catch (error) {
    console.error('Erreur getCategories:', error);
    res.status(500).json({ error: error.message });
  }
};

// POST /api/categories-reclamation → Ajouter une catégorie
export const createCategorie = async (req, res) => {
  const { id, label, description, bg_color, icon_key, ordre } = req.body;
  if (!id || !label || !icon_key)
    return res.status(400).json({ error: 'id, label et icon_key sont obligatoires' });

  const { data, error } = await supabaseAdmin
    .from('categories_reclamation')
    .insert({ id, label, description, bg_color: bg_color || '#E6F1FB', icon_key, ordre: ordre || 0 })
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
};

// PUT /api/categories-reclamation/:id → Modifier une catégorie
export const updateCategorie = async (req, res) => {
  const { label, description, bg_color, icon_key, ordre, actif } = req.body;
  const updates = {};
  if (label       !== undefined) updates.label       = label;
  if (description !== undefined) updates.description = description;
  if (bg_color    !== undefined) updates.bg_color    = bg_color;
  if (icon_key    !== undefined) updates.icon_key    = icon_key;
  if (ordre       !== undefined) updates.ordre       = ordre;
  if (actif       !== undefined) updates.actif       = actif;

  const { data, error } = await supabaseAdmin
    .from('categories_reclamation')
    .update(updates)
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

// DELETE /api/categories-reclamation/:id → Désactiver (soft delete)
export const deleteCategorie = async (req, res) => {
  const { error } = await supabaseAdmin
    .from('categories_reclamation')
    .update({ actif: false })
    .eq('id', req.params.id);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Catégorie désactivée' });
};

// POST /api/categories-reclamation/:id/types → Ajouter un type
export const createType = async (req, res) => {
  const { groupe_titre, item_label, ordre } = req.body;
  if (!groupe_titre || !item_label)
    return res.status(400).json({ error: 'groupe_titre et item_label sont obligatoires' });

  const { data, error } = await supabaseAdmin
    .from('types_reclamation')
    .insert({ categorie_id: req.params.id, groupe_titre, item_label, ordre: ordre || 0 })
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
};

// DELETE /api/categories-reclamation/types/:typeId → Désactiver un type
export const deleteType = async (req, res) => {
  const { error } = await supabaseAdmin
    .from('types_reclamation')
    .update({ actif: false })
    .eq('id', req.params.typeId);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Type désactivé' });
};