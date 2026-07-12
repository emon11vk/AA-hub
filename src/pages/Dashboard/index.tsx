export default function Dashboard() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-serif font-bold text-text-primary">Tổng quan</h1>
      </div>
      
      <div className="grid grid-cols-4 gap-6">
        {[
          { title: 'Tổng thu tháng này', value: '150.000.000 đ', color: 'text-green-600' },
          { title: 'Tổng chi tháng này', value: '45.000.000 đ', color: 'text-primary' },
          { title: 'Quỹ tiền mặt', value: '25.000.000 đ', color: 'text-blue-600' },
          { title: 'Tiền gửi ngân hàng', value: '180.000.000 đ', color: 'text-purple-600' },
        ].map((stat, idx) => (
          <div key={idx} className="card p-6">
            <h3 className="text-sm font-medium text-text-secondary mb-2">{stat.title}</h3>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
