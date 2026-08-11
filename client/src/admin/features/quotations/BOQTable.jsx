import Button from '../../../shared/components/common/Button';
import { formatCurrency } from '../../../shared/utils/formatters';

/** Editable BOQ (bill of quantities) line-item table. All arithmetic here is for display only.*/

function BOQTable({ items = [], onChange }) {
  const updateItem = (index, field, value) => {
    const next = items.map((item, i) => (i === index ? { ...item, [field]: value } : item));
    onChange?.(next);
  };

  const addItem = () => {
    onChange?.([...items, { description: '', quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (index) => {
    onChange?.(items.filter((_, i) => i !== index));
  };

  const total = items.reduce((sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0), 0);

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2 text-left font-medium text-gray-600">Description</th>
            <th className="px-3 py-2 text-left font-medium text-gray-600">Qty</th>
            <th className="px-3 py-2 text-left font-medium text-gray-600">Unit price</th>
            <th className="px-3 py-2 text-left font-medium text-gray-600">Line total</th>
            <th className="px-3 py-2" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {items.map((item, index) => (
            <tr key={index}>
              <td className="px-3 py-2">
                <input
                  value={item.description}
                  maxLength={300}
                  onChange={(e) => updateItem(index, 'description', e.target.value)}
                  className="w-full rounded border border-gray-300 px-2 py-1"
                />
              </td>
              <td className="px-3 py-2">
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                  className="w-20 rounded border border-gray-300 px-2 py-1"
                />
              </td>
              <td className="px-3 py-2">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.unitPrice}
                  onChange={(e) => updateItem(index, 'unitPrice', e.target.value)}
                  className="w-28 rounded border border-gray-300 px-2 py-1"
                />
              </td>
              <td className="px-3 py-2 text-gray-700">
                {formatCurrency((Number(item.quantity) || 0) * (Number(item.unitPrice) || 0))}
              </td>
              <td className="px-3 py-2">
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-xs text-red-600 hover:underline"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-3 py-2">
        <Button type="button" variant="secondary" onClick={addItem}>
          Add line item
        </Button>
        <span className="text-sm font-semibold text-gray-900">Total: {formatCurrency(total)}</span>
      </div>
    </div>
  );
}

export default BOQTable;
