// Generic category-tree helpers. Generic so callers can pass either the raw
// `Category` row from the DB or any locally-shaped object that carries `id`
// and `parent_id` (e.g. a server-localized {id, slug, parent_id, label}).

interface WithParentId {
  id: string;
  parent_id: string | null;
}

/** A tree node — the original record extended with its `children`. */
export type CategoryTree<T extends WithParentId> = T & {
  children: CategoryTree<T>[];
};

/**
 * Convert a flat list of categories into a tree by linking children to their
 * parent through `parent_id`. Records whose `parent_id` does not resolve to
 * an entry in `flat` are surfaced as roots so they never silently disappear.
 *
 * The function does not mutate its input.
 */
export function buildCategoryTree<T extends WithParentId>(
  flat: readonly T[]
): CategoryTree<T>[] {
  const byId = new Map<string, CategoryTree<T>>();
  for (const item of flat) {
    byId.set(item.id, { ...item, children: [] });
  }

  const roots: CategoryTree<T>[] = [];
  for (const item of flat) {
    const node = byId.get(item.id)!;
    if (item.parent_id) {
      const parent = byId.get(item.parent_id);
      if (parent) {
        parent.children.push(node);
      } else {
        // Orphan — its parent is missing from the input. Treat as root.
        roots.push(node);
      }
    } else {
      roots.push(node);
    }
  }

  return roots;
}

/**
 * Return only the leaf categories — those that have a parent (so they are
 * narrow enough to make sense as a filter target) and no children of their
 * own. Used by surfaces like the products quick-filter bar where mixing
 * parent groupings would create ambiguous filter behaviour.
 */
export function getLeafCategories<T extends WithParentId>(
  flat: readonly T[]
): T[] {
  const parentIds = new Set<string>();
  for (const item of flat) {
    if (item.parent_id) parentIds.add(item.parent_id);
  }
  return flat.filter(
    (item) => item.parent_id !== null && !parentIds.has(item.id)
  );
}
