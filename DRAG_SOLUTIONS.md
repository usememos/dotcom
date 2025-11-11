# Drag & Drop Solutions Comparison

## Current Implementation (Vanilla JS + Window Listeners)

**Location:** `src/components/scratch/workspace.tsx`

### Pros
- ✅ Zero additional dependencies
- ✅ Full control over behavior
- ✅ Lightweight (~150 lines)
- ✅ Already working and tested
- ✅ Uses RAF for performance
- ✅ Follows sticky-notes reference pattern

### Cons
- ❌ More imperative code
- ❌ Manual event cleanup required
- ❌ No touch support out of the box
- ❌ More verbose than hook-based solutions

---

## Option 1: Framer Motion 🏆 RECOMMENDED

**Location:** `src/components/scratch/text-item-motion.tsx`

### Pros
- ✅ **Declarative API** - Just add `drag` prop
- ✅ **Smooth animations** built-in
- ✅ **Touch + Mouse** support automatically
- ✅ **whileDrag** states for visual feedback
- ✅ Great performance with hardware acceleration
- ✅ Excellent TypeScript support
- ✅ Can add spring animations, constraints, etc.
- ✅ Most React-idiomatic solution

### Cons
- ❌ Adds ~60KB to bundle (gzipped: ~20KB)
- ❌ Learning curve if unfamiliar with Framer Motion

### Usage Example
```tsx
<motion.div
  drag
  dragMomentum={false}
  onDrag={(e, info) => {
    onUpdate(item.id, {
      x: item.x + info.delta.x,
      y: item.y + info.delta.y,
    });
  }}
  whileDrag={{ opacity: 0.5 }}
>
  {/* Card content */}
</motion.div>
```

### When to Use
- ✅ You want animations alongside dragging
- ✅ You need touch support
- ✅ You prefer declarative React patterns
- ✅ Bundle size is acceptable

---

## Option 2: @use-gesture/react

**Location:** `src/components/scratch/workspace-gesture.tsx`

### Pros
- ✅ Lightweight (~14KB gzipped)
- ✅ Hook-based React API
- ✅ Touch + Mouse + Wheel gestures
- ✅ Built-in RAF throttling
- ✅ Great for complex gesture handling

### Cons
- ❌ Slightly more complex setup
- ❌ Requires wrapping each item in gesture provider
- ❌ Less intuitive than Framer Motion

### Usage Example
```tsx
const bind = useDrag(({ offset: [ox, oy], first, last }) => {
  if (last) {
    onUpdate(item.id, { x: startPos.x + ox, y: startPos.y + oy });
  }
});

return <div {...bind()}>Card</div>;
```

### When to Use
- ✅ You need lightweight gesture library
- ✅ You want complex gesture combinations (drag + pinch + rotate)
- ❌ Not recommended for simple drag-only use cases

---

## Option 3: Custom React Hook (Best Balance)

**Location:** `src/hooks/use-draggable.ts`

### Pros
- ✅ Zero dependencies
- ✅ Fully customized to your needs
- ✅ React hook pattern
- ✅ Reusable across components
- ✅ Touch support can be added easily
- ✅ Complete control

### Cons
- ❌ Need to maintain custom code
- ❌ Less features than libraries

### Implementation
```tsx
export function useDraggable(
  ref: RefObject<HTMLElement>,
  onDrag: (delta: { x: number; y: number }) => void,
  enabled = true
) {
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!enabled || !ref.current) return;

    const element = ref.current;
    let startPos = { x: 0, y: 0 };

    const handleMouseDown = (e: MouseEvent) => {
      startPos = { x: e.pageX, y: e.pageY };
      setIsDragging(true);

      const handleMouseMove = (e: MouseEvent) => {
        onDrag({
          x: e.pageX - startPos.x,
          y: e.pageY - startPos.y,
        });
        startPos = { x: e.pageX, y: e.pageY };
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    };

    element.addEventListener('mousedown', handleMouseDown);
    return () => element.removeEventListener('mousedown', handleMouseDown);
  }, [enabled, onDrag, ref]);

  return { isDragging };
}
```

---

## Option 4: dnd-kit

### Pros
- ✅ Modern, accessible
- ✅ Tree-shakeable
- ✅ Great for sortable lists, drag-drop between containers
- ✅ Built for React 18+

### Cons
- ❌ **Overkill** for free-form dragging
- ❌ Designed for sortable/droppable zones (not canvas)
- ❌ More complex setup
- ❌ Larger bundle (~30KB gzipped)

### When to Use
- ✅ Sortable lists
- ✅ Drag-and-drop between containers
- ❌ **NOT recommended for canvas-style free dragging**

---

## Option 5: react-draggable

### Pros
- ✅ Simple API
- ✅ Small bundle (~10KB gzipped)
- ✅ Good for basic dragging

### Cons
- ❌ Less maintained (last update 2+ years ago)
- ❌ No React 19 support confirmed
- ❌ Less features than Framer Motion

---

## Recommendation Matrix

| Use Case | Best Solution |
|----------|--------------|
| **Current project** (already working) | Keep vanilla JS or upgrade to **Framer Motion** |
| **Want animations** | **Framer Motion** 🏆 |
| **Need touch support** | **Framer Motion** or **@use-gesture** |
| **Smallest bundle** | **Custom Hook** |
| **Most React-idiomatic** | **Framer Motion** 🏆 |
| **Complex gestures** | **@use-gesture** |
| **Quick prototype** | Keep current vanilla JS |

---

## Migration Path

### If staying with vanilla JS:
Current implementation is already optimized. No changes needed.

### If migrating to Framer Motion (Recommended):
1. Replace `TextItem` with `TextItemMotion`
2. Replace `FileItem` with `FileItemMotion` (similar pattern)
3. Remove manual drag handlers from workspace
4. Test touch devices

### If creating custom hook:
1. Create `use-draggable.ts` hook
2. Use in TextItem/FileItem
3. Remove workspace-level drag handling
4. Add touch event handlers if needed

---

## My Recommendation 🎯

**For this project:** I recommend **Framer Motion** because:

1. You already have the base working - no rush to change
2. Framer Motion provides the cleanest API
3. You get smooth animations + touch support for free
4. Bundle size is acceptable for a modern web app
5. Future-proof for adding animations to cards
6. Widely used, well-maintained, excellent docs

**Alternative:** If you want to keep it minimal, create a custom `useDraggable` hook to make the current solution more React-idiomatic without adding dependencies.

**Don't change if:** Current solution works fine and bundle size is critical. The vanilla JS implementation is actually very good!
