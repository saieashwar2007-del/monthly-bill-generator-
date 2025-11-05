import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function MonthlyBillGenerator() {
  const [members, setMembers] = useState([
    { name: "Naveen", rent: 7500, power: 0 },
    { name: "Yalamandha", rent: 8000, power: 0 },
    { name: "Kannababu", rent: 8000, power: 0 }
  ]);

  const [maidTotal, setMaidTotal] = useState(400);
  const [waterTotal, setWaterTotal] = useState(356);
  const [boreTotal, setBoreTotal] = useState(0);
  const [includeOwnerInShare, setIncludeOwnerInShare] = useState(true);

  const numberOfSharers = includeOwnerInShare ? members.length + 1 : members.length;
  const maidShare = +(maidTotal / numberOfSharers).toFixed(2);
  const waterShare = +(waterTotal / numberOfSharers).toFixed(2);
  const boreShare = +(boreTotal / numberOfSharers).toFixed(2);

  const computeTotal = (rent, power) => {
    return +(rent + maidShare + waterShare + boreShare + (power || 0)).toFixed(2);
  };

  const generateMessage = (m) => {
    const total = computeTotal(m.rent, m.power);
    const parts = [`₹${m.rent} rent`, `₹${maidShare} maid`, `₹${waterShare} water`, `₹${boreShare} bore`];
    if (m.power > 0) parts.push(`₹${m.power} power`);
    return `Hi ${m.name} 👋,\nThis month's total is ₹${total.toFixed(2)}\n(${parts.join(" + ")}). 😊`;
  };

  const messages = members.map((m) => generateMessage(m));

  function handleMemberChange(idx, field, value) {
    const next = [...members];
    next[idx] = { ...next[idx], [field]: field === "rent" || field === "power" ? Number(value) : value };
    setMembers(next);
  }

  function addMember() {
    setMembers([...members, { name: "New Member", rent: 0, power: 0 }]);
  }

  function removeMember(idx) {
    const next = members.filter((_, i) => i !== idx);
    setMembers(next);
  }

  function copyAll() {
    navigator.clipboard.writeText(messages.join("\n\n")).then(() => {
      alert("All messages copied to clipboard — now paste into WhatsApp.");
    });
  }

  function copyIndividual(msg, name) {
    navigator.clipboard.writeText(msg).then(() => {
      alert(`Message for ${name} copied to clipboard.`);
    });
  }

  function downloadTxt() {
    const blob = new Blob([messages.join("\n\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `WhatsApp_Messages_${new Date().toISOString().slice(0,10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-8">
      <h1 className="text-2xl font-semibold mb-4">Monthly Bill Generator</h1>

      <section className="mb-6">
        <h2 className="font-medium">Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
          <label className="flex flex-col relative">
            <span className="text-sm text-gray-600">Maid total (₹, including owner)</span>
            <input
              type="number"
              className="mt-1 p-2 border rounded"
              value={maidTotal}
              onChange={(e) => setMaidTotal(Number(e.target.value))}
            />
            <AnimatePresence>
              <motion.span
                key={maidShare}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.3 }}
                className="text-xs text-gray-500 mt-1"
              >
                Each share: ₹{maidShare} ({numberOfSharers} sharers)
              </motion.span>
            </AnimatePresence>
          </label>

          <label className="flex flex-col">
            <span className="text-sm text-gray-600">Water total (₹)</span>
            <input
              type="number"
              className="mt-1 p-2 border rounded"
              value={waterTotal}
              onChange={(e) => setWaterTotal(Number(e.target.value))}
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm text-gray-600">Bore total (₹)</span>
            <input
              type="number"
              className="mt-1 p-2 border rounded"
              value={boreTotal}
              onChange={(e) => setBoreTotal(Number(e.target.value))}
            />
          </label>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={includeOwnerInShare}
              onChange={(e) => setIncludeOwnerInShare(e.target.checked)}
            />
            <span className="text-sm">Include owner in shared split (divide by {numberOfSharers})</span>
          </label>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="font-medium">Members</h2>
        <div className="mt-3 space-y-3">
          {members.map((m, idx) => (
            <div key={idx} className="flex flex-wrap gap-3 items-center">
              <label className="flex flex-col flex-1">
                <span className="text-sm text-gray-600">Member Name</span>
                <input
                  className="p-2 border rounded"
                  value={m.name}
                  onChange={(e) => handleMemberChange(idx, "name", e.target.value)}
                />
              </label>
              <label className="flex flex-col">
                <span className="text-sm text-gray-600">Rent (₹)</span>
                <input
                  className="w-28 p-2 border rounded"
                  type="number"
                  value={m.rent}
                  onChange={(e) => handleMemberChange(idx, "rent", e.target.value)}
                  placeholder="Rent ₹"
                />
              </label>
              <label className="flex flex-col">
                <span className="text-sm text-gray-600">Power Bill (₹, optional)</span>
                <input
                  className="w-32 p-2 border rounded"
                  type="number"
                  value={m.power}
                  onChange={(e) => handleMemberChange(idx, "power", e.target.value)}
                  placeholder="Power bill ₹ (optional)"
                />
              </label>
              <button
                className="px-3 py-1 bg-red-500 text-white rounded h-fit self-end"
                onClick={() => removeMember(idx)}
              >
                Remove
              </button>
            </div>
          ))}

          <div>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded"
              onClick={addMember}
            >
              Add Member
            </button>
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="font-medium">Calculated Shares</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-right">Rent (₹)</th>
                <th className="p-2 text-right">Power (₹)</th>
                <th className="p-2 text-right">Maid (₹)</th>
                <th className="p-2 text-right">Water share (₹)</th>
                <th className="p-2 text-right">Bore share (₹)</th>
                <th className="p-2 text-right">Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2">{m.name}</td>
                  <td className="p-2 text-right">{m.rent.toFixed(2)}</td>
                  <td className="p-2 text-right">{m.power > 0 ? m.power.toFixed(2) : "—"}</td>
                  <td className="p-2 text-right">{maidShare.toFixed(2)}</td>
                  <td className="p-2 text-right">{waterShare.toFixed(2)}</td>
                  <td className="p-2 text-right">{boreShare.toFixed(2)}</td>
                  <td className="p-2 text-right font-semibold">{computeTotal(m.rent, m.power).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="font-medium">WhatsApp Messages</h2>
        <div className="mt-3 space-y-4">
          {members.map((m, i) => (
            <div key={i} className="bg-gray-50 p-3 rounded shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">{m.name}</h3>
                <button
                  onClick={() => copyIndividual(messages[i], m.name)}
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                >
                  Copy Message
                </button>
              </div>
              <pre className="whitespace-pre-wrap text-sm">{messages[i]}</pre>
            </div>
          ))}

          <div className="flex gap-3 mt-4">
            <button onClick={copyAll} className="px-4 py-2 bg-green-700 text-white rounded">
              Copy All Messages
            </button>
            <button onClick={downloadTxt} className="px-4 py-2 bg-indigo-600 text-white rounded">
              Download .txt
            </button>
          </div>
        </div>
      </section>

      <footer className="text-sm text-gray-500 mt-4">
        Tip: Each tenant's message has an individual copy button. The owner is included only in shared splits (no bill/message generated). Power bill is optional — leave it blank or zero if not applicable.
      </footer>
    </div>
  );
}
