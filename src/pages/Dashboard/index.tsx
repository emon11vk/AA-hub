export default function Dashboard() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-sans font-bold text-gray-900 tracking-tight">Tổng quan tài chính</h1>
        <div className="text-sm text-gray-500 font-medium">Kỳ kế toán: Tháng 7/2026</div>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <h2 className="text-[15px] font-semibold text-gray-900">Số dư tài khoản tiền</h2>
          <button className="text-sm font-medium text-[#b91c1c] hover:text-red-800 transition-colors">
            Xem sổ chi tiết
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white text-gray-500 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 font-medium">Tài khoản</th>
                <th className="px-6 py-3 font-medium">Tên tài khoản</th>
                <th className="px-6 py-3 font-medium text-right">Dư Nợ</th>
                <th className="px-6 py-3 font-medium text-right">Dư Có</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-900">
              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-medium">1111</td>
                <td className="px-6 py-4">Tiền mặt bằng VNĐ</td>
                <td className="px-6 py-4 text-right font-medium text-gray-900">25.000.000</td>
                <td className="px-6 py-4 text-right text-gray-400">-</td>
              </tr>
              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-medium">1121</td>
                <td className="px-6 py-4">Tiền gửi ngân hàng VNĐ</td>
                <td className="px-6 py-4 text-right font-medium text-gray-900">180.000.000</td>
                <td className="px-6 py-4 text-right text-gray-400">-</td>
              </tr>
              <tr className="bg-gray-50 font-semibold border-t-2 border-gray-200 text-gray-900">
                <td className="px-6 py-4" colSpan={2}>Tổng cộng</td>
                <td className="px-6 py-4 text-right">205.000.000</td>
                <td className="px-6 py-4 text-right text-gray-400">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <h2 className="text-[15px] font-semibold text-gray-900">Hoạt động trong kỳ</h2>
          <button className="text-sm font-medium text-[#b91c1c] hover:text-red-800 transition-colors">
            Xem nhật ký chung
          </button>
        </div>
        <div className="p-6 grid grid-cols-2 gap-8">
          <div>
            <div className="text-sm text-gray-500 mb-1">Tổng thu (Phát sinh Nợ 111, 112)</div>
            <div className="text-2xl font-bold text-gray-900 tracking-tight">150.000.000</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">Tổng chi (Phát sinh Có 111, 112)</div>
            <div className="text-2xl font-bold text-gray-900 tracking-tight">45.000.000</div>
          </div>
        </div>
      </div>
    </div>
  );
}
