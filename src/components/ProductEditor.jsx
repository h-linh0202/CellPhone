// src/components/ProductEditor.jsx
import React, { useEffect, useState } from 'react';

const emptyProduct = {
  name: '',
  image: '',
  price: 0,
  special_price: null,
  old_price: null,
  tskt: [], // [{name, value}]
  capacities: [] // [{capacity, price, color: [{color, price}]}]
};

const ProductEditor = ({ open, product, onClose, onSave }) => {
  const [form, setForm] = useState(emptyProduct);
  const [tsktText, setTsktText] = useState(''); // simple textarea "k:v\nk2:v2"
  const [capacitiesText, setCapacitiesText] = useState(''); // "cap|price\ncap2|price2"

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        image: product.image || '',
        price: product.price ?? 0,
        special_price: product.special_price ?? null,
        old_price: product.old_price ?? null,
        tskt: product.tskt || [],
        capacities: product.capacities || []
      });

      setTsktText(
        (product.tskt || []).map(t => `${t.name}:${t.value}`).join('\n')
      );
      setCapacitiesText(
        (product.capacities || []).map(c => `${c.capacity}|${c.price}`).join('\n')
      );
    } else {
      setForm(emptyProduct);
      setTsktText('');
      setCapacitiesText('');
    }
  }, [product, open]);

  if (!open) return null;

  const parseTskt = (text) => {
    return text
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean)
      .map(line => {
        const [name, ...rest] = line.split(':');
        return { name: name?.trim() || '', value: rest.join(':').trim() || '' };
      });
  };

  const parseCapacities = (text) => {
    return text
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean)
      .map(line => {
        const [capacity, price] = line.split('|');
        return { capacity: capacity?.trim() || '', price: Number(price || 0) };
      });
  };

  const handleSave = () => {
    const payload = {
      ...form,
      tskt: parseTskt(tsktText),
      capacities: parseCapacities(capacitiesText)
    };
    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6 overflow-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold"> {product ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">Đóng ✕</button>
        </div>

        <div className="space-y-3">
          <label className="block">
            Tên sản phẩm
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
              className="w-full border rounded px-2 py-1 mt-1" />
          </label>

          <label className="block">
            Ảnh (URL)
            <input value={form.image} onChange={e => setForm({...form, image: e.target.value})}
              className="w-full border rounded px-2 py-1 mt-1" />
          </label>

          <div className="grid grid-cols-3 gap-2">
            <label className="block">
              Giá (VNĐ)
              <input type="number" value={form.price} onChange={e => setForm({...form, price: Number(e.target.value)})}
                className="w-full border rounded px-2 py-1 mt-1" />
            </label>
            <label className="block">
              Giá khuyến mãi (nếu có)
              <input type="number" value={form.special_price ?? ''} onChange={e => setForm({...form, special_price: e.target.value ? Number(e.target.value) : null})}
                className="w-full border rounded px-2 py-1 mt-1" />
            </label>
            <label className="block">
              Giá cũ (nếu có)
              <input type="number" value={form.old_price ?? ''} onChange={e => setForm({...form, old_price: e.target.value ? Number(e.target.value) : null})}
                className="w-full border rounded px-2 py-1 mt-1" />
            </label>
          </div>

          <label className="block">
            Thông số (mỗi dòng `Tên:Giá trị`)
            <textarea value={tsktText} onChange={e => setTsktText(e.target.value)}
              className="w-full border rounded px-2 py-1 mt-1" rows={4} />
          </label>

          <label className="block">
            Phiên bản (mỗi dòng `Dung lượng|Giá`)
            <textarea value={capacitiesText} onChange={e => setCapacitiesText(e.target.value)}
              className="w-full border rounded px-2 py-1 mt-1" rows={3} />
          </label>

          <div className="flex justify-end gap-3 mt-4">
            <button onClick={onClose} className="px-4 py-2 rounded border">Hủy</button>
            <button onClick={handleSave} className="px-4 py-2 rounded bg-blue-600 text-white">Lưu</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductEditor;
