import React, { useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/db';
import { Calculator, Filter } from 'lucide-react';

export default function TrialBalance() {
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');

  const taiKhoanList = useLiveQuery(() => db.taiKhoanKeToan.toArray());
  const chungTuList = useLiveQuery(() => db.chungTu.toArray());

  const reportData = useMemo(() => {
    if (!taiKhoanList || !chungTuList) return [];

    let filteredCT = chungTuList;
    if (fromDate) filteredCT = filteredCT.filter(ct => ct.ngayHachToan >= fromDate);
    if (toDate) filteredCT = filteredCT.filter(ct => ct.ngayHachToan <= toDate);

    // Calculate sum of debits and credits per account
    const phatSinhMap: Record<string, { no: number, co: number }> = {};
    
    taiKhoanList.forEach(tk => {
      phatSinhMap[tk.soHieu] = { no: 0, co: 0 };
    });

    filteredCT.forEach(ct => {
      ct.butToan.forEach(bt => {
        // Find exact or closest parent account if sub-account used
        const tkNo = bt.tkNo;
        const tkCo = bt.tkCo;
        
        // Match account logic (simplistic: match exact or prefix up to 3 chars)
        const matchAccount = (tkCode: string) => {
          if (phatSinhMap[tkCode]) return tkCode;
          const parent3 = tkCode.substring(0, 3);
          if (phatSinhMap[parent3]) return parent3;
          return null;
        };

        const matchedNo = matchAccount(tkNo);
        if (matchedNo) {
          phatSinhMap[matchedNo].no += bt.soTien;
        }

        const matchedCo = matchAccount(tkCo);
        if (matchedCo) {
          phatSinhMap[matchedCo].co += bt.soTien;
        }
      });
    });

    // Compute final table data
    const tableData = taiKhoanList.map(tk => {
      const ps = phatSinhMap[tk.soHieu];
      let endNo = 0;
      let endCo = 0;

      if (tk.loaiTaiKhoan === 'TAI_SAN' || tk.loaiTaiKhoan === 'CHI_PHI') {
        const balance = tk.duNoDauKy - tk.duCoDauKy + ps.no - ps.co;
        if (balance > 0) endNo = balance;
        else endCo = -balance;
      } else {
        const balance = tk.duCoDauKy - tk.duNoDauKy + ps.co - ps.no;
        if (balance > 0) endCo = balance;
        else endNo = -balance;
      }

      return {
        ...tk,
        psNo: ps.no,
        psCo: ps.co,
        endNo,
        endCo
      };
    }).filter(row => 
      row.duNoDauKy > 0 || row.duCoDauKy > 0 || row.psNo > 0 || row.psCo > 0 || row.endNo > 0 || row.endCo > 0
    );

    tableData.sort((a, b) => a.soHieu.localeCompare(b.soHieu));

    return tableData;
  }, [taiKhoanList, chungTuList, fromDate, toDate]);

  const totals = useMemo(() => {
    return reportData.reduce((acc, row) => ({
      duNoDauKy: acc.duNoDauKy + row.duNoDauKy,
      duCoDauKy: acc.duCoDauKy + row.duCoDauKy,
      psNo: acc.psNo + row.psNo,
      psCo: acc.psCo + row.psCo,
      endNo: acc.endNo + row.endNo,
      endCo: acc.endCo + row.endCo,
    }), {
      duNoDauKy: 0, duCoDauKy: 0, psNo: 0, psCo: 0, endNo: 0, endCo: 0
    });
  }, [reportData]);

  const formatCurrency = (amount: number) => {
    if (amount === 0) return '-';
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-500/10 p-2 rounded-lg">
          <Calculator className="text-blue-600" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Bảng Cân Đối Số Phát Sinh</h1>
          <p className="text-text-muted text-sm mt-1">Tổng hợp số dư và phát sinh các tài khoản</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-border p-4 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={18} className="text-text-muted" />
          <h2 className="font-semibold text-text-primary">Thời gian báo cáo</h2>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-text-secondary mb-1">Từ ngày</label>
            <input 
              type="date" 
              className="w-full h-10 px-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-text-secondary mb-1">Đến ngày</label>
            <input 
              type="date" 
              className="w-full h-10 px-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-bg-muted text-text-secondary font-medium border-b border-border">
              <tr>
                <th rowSpan={2} className="px-4 py-3 whitespace-nowrap border-r border-border text-center">Số hiệu TK</th>
                <th rowSpan={2} className="px-4 py-3 min-w-[250px] border-r border-border">Tên tài khoản</th>
                <th colSpan={2} className="px-4 py-2 border-b border-r border-border text-center">Số dư đầu kỳ</th>
                <th colSpan={2} className="px-4 py-2 border-b border-r border-border text-center">Phát sinh trong kỳ</th>
                <th colSpan={2} className="px-4 py-2 border-b border-border text-center">Số dư cuối kỳ</th>
              </tr>
              <tr>
                <th className="px-4 py-2 border-r border-border text-right">Nợ</th>
                <th className="px-4 py-2 border-r border-border text-right">Có</th>
                <th className="px-4 py-2 border-r border-border text-right bg-blue-50/50">Nợ</th>
                <th className="px-4 py-2 border-r border-border text-right bg-blue-50/50">Có</th>
                <th className="px-4 py-2 border-r border-border text-right bg-green-50/50">Nợ</th>
                <th className="px-4 py-2 text-right bg-green-50/50">Có</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {reportData.map((row) => (
                <tr key={row.id} className="hover:bg-bg-muted/50 transition-colors">
                  <td className="px-4 py-3 font-mono text-center border-r border-border">{row.soHieu}</td>
                  <td className="px-4 py-3 font-medium text-text-secondary border-r border-border">{row.tenTaiKhoan}</td>
                  
                  <td className="px-4 py-3 text-right border-r border-border">{formatCurrency(row.duNoDauKy)}</td>
                  <td className="px-4 py-3 text-right border-r border-border">{formatCurrency(row.duCoDauKy)}</td>
                  
                  <td className="px-4 py-3 text-right border-r border-border bg-blue-50/10 font-medium">{formatCurrency(row.psNo)}</td>
                  <td className="px-4 py-3 text-right border-r border-border bg-blue-50/10 font-medium">{formatCurrency(row.psCo)}</td>
                  
                  <td className="px-4 py-3 text-right border-r border-border bg-green-50/10 font-medium text-green-700">{formatCurrency(row.endNo)}</td>
                  <td className="px-4 py-3 text-right bg-green-50/10 font-medium text-green-700">{formatCurrency(row.endCo)}</td>
                </tr>
              ))}
              
              {/* TỔNG CỘNG */}
              <tr className="bg-bg-muted font-bold text-text-primary">
                <td colSpan={2} className="px-4 py-4 text-center border-r border-border uppercase">Tổng cộng</td>
                <td className="px-4 py-4 text-right border-r border-border">{formatCurrency(totals.duNoDauKy)}</td>
                <td className="px-4 py-4 text-right border-r border-border">{formatCurrency(totals.duCoDauKy)}</td>
                
                <td className="px-4 py-4 text-right border-r border-border text-blue-700">{formatCurrency(totals.psNo)}</td>
                <td className="px-4 py-4 text-right border-r border-border text-blue-700">{formatCurrency(totals.psCo)}</td>
                
                <td className="px-4 py-4 text-right border-r border-border text-green-700">{formatCurrency(totals.endNo)}</td>
                <td className="px-4 py-4 text-right text-green-700">{formatCurrency(totals.endCo)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
