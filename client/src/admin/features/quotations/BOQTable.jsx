import { formatCurrency } from '../../../shared/utils/formatters';

function BOQTable({ items = [], onChange }) {
  const updateItem = (index, field, value) => {
    onChange?.(items.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const addItem = () => {
    onChange?.([...items, { description: '', unit: '', quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (index) => {
    onChange?.(items.filter((_, i) => i !== index));
  };

  const total = items.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0),
    0
  );

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Description</th>
              <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Unit</th>
              <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Qty</th>
              <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Unit price</th>
              <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Line total</th>
              <th className="px-3 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {items.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-sm text-gray-400">
                  No line items yet.
                </td>
              </tr>
            )}
            {items.map((item, index) => (
              <tr key={index}>
                <td className="px-3 py-2">
                  <input
                    value={item.description}
                    maxLength={300}
                    placeholder="e.g. Cement (50kg bags)"
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm outline-none focus:border-[#f5b400] focus:ring-2 focus:ring-[#f5b400]/10"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    value={item.unit || ''}
                    maxLength={20}
                    placeholder="e.g. bag"
                    onChange={(e) => updateItem(index, 'unit', e.target.value)}
                    className="w-20 rounded-md border border-gray-300 px-2 py-1.5 text-sm outline-none focus:border-[#f5b400] focus:ring-2 focus:ring-[#f5b400]/10"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                    className="w-20 rounded-md border border-gray-300 px-2 py-1.5 text-sm outline-none focus:border-[#f5b400] focus:ring-2 focus:ring-[#f5b400]/10"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(index, 'unitPrice', e.target.value)}
                    className="w-28 rounded-md border border-gray-300 px-2 py-1.5 text-sm outline-none focus:border-[#f5b400] focus:ring-2 focus:ring-[#f5b400]/10"
                  />
                </td>
                <td className="px-3 py-2 font-medium text-[#071525]">
                  {formatCurrency((Number(item.quantity) || 0) * (Number(item.unitPrice) || 0))}
                </td>
                <td className="px-3 py-2">
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-xs font-semibold text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-3 py-2.5">
        <button
          type="button"
          onClick={addItem}
          className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm font-semibold text-[#071525] transition-colors hover:border-[#f5b400] hover:text-[#f5b400]"
        >
          + Add line item
        </button>
        <span className="text-sm font-bold text-[#071525]">Subtotal: {formatCurrency(total)}</span>
      </div>
    </div>
  );
}

export default BOQTable;