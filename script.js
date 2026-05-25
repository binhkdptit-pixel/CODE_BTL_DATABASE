const storageKey = 'warehouseDB_v2';

const tableConfigs = {
    hanghoa: [
        { label: 'Mã Hàng Hóa', key: 'ma', readonly: true, pattern: '^[A-Za-z0-9]+$', title: 'Chỉ nhập chữ và số, không nhập ký tự đặc biệt' },
        { label: 'Tên Hàng Hóa', key: 'ten' },
        { label: 'Loại Hàng', key: 'loai' },
        { label: 'Đơn Vị Tính', key: 'dvt' },
        { label: 'Giá Nhập (VND)', key: 'gianhap', type: 'number', title: 'Chỉ nhập số' },
        { label: 'Giá Bán (VND)', key: 'giaban', type: 'number', title: 'Chỉ nhập số' }
    ],
    nhacungcap: [
        { label: 'Mã Nhà Cung Cấp', key: 'ma', readonly: true, pattern: '^[A-Za-z0-9]+$', title: 'Chỉ nhập chữ và số, không nhập ký tự đặc biệt' },
        { label: 'Tên Nhà Cung Cấp', key: 'ten' },
        { label: 'Địa Chỉ', key: 'diachi' },
        { label: 'Số Điện Thoại', key: 'sdt', type: 'tel', pattern: '^[0-9]+$', title: 'Chỉ nhập số' }
    ],
    khachhang: [
        { label: 'Mã Khách Hàng', key: 'ma', readonly: true, pattern: '^[A-Za-z0-9]+$', title: 'Chỉ nhập chữ và số, không nhập ký tự đặc biệt' },
        { label: 'Tên Khách Hàng', key: 'ten' },
        { label: 'Địa Chỉ', key: 'diachi' },
        { label: 'Số Điện Thoại', key: 'sdt', type: 'tel', pattern: '^[0-9]+$', title: 'Chỉ nhập số' },
        { label: 'Email Liên Hệ', key: 'email', type: 'email' }
    ],
    nhanvien: [
        { label: 'Mã Nhân Viên', key: 'ma', readonly: true, pattern: '^[A-Za-z0-9]+$', title: 'Chỉ nhập chữ và số, không nhập ký tự đặc biệt' },
        { label: 'Họ Tên Nhân Viên', key: 'ten' },
        { label: 'Chức Vụ', key: 'chucvu' },
        { label: 'Tài Khoản Hệ Thống', key: 'taikhoan' },
        { label: 'Quyền Truy Cập', key: 'quyen' }
    ],
    phieunhap: [
        { label: 'Mã Phiếu Nhập', key: 'ma', readonly: true, pattern: '^[A-Za-z0-9]+$', title: 'Chỉ nhập chữ và số, không nhập ký tự đặc biệt' },
        { label: 'Ngày Nhập Kho', key: 'ngay', type: 'date' },
        { label: 'Mã Nhà Cung Cấp', key: 'ncc' },
        { label: 'Mã Nhân Viên Lập', key: 'nv' },
        { label: 'Danh Sách Mặt Hàng', key: 'chitiet' },
        { label: 'Tổng Tiền Giá Trị (VND)', key: 'tongtien', type: 'number', title: 'Chỉ nhập số' }
    ],
    phieuxuat: [
        { label: 'Mã Phiếu Xuất', key: 'ma', readonly: true, pattern: '^[A-Za-z0-9]+$', title: 'Chỉ nhập chữ và số, không nhập ký tự đặc biệt' },
        { label: 'Ngày Xuất Kho', key: 'ngay', type: 'date' },
        { label: 'Mã Khách Hàng', key: 'kh' },
        { label: 'Mã Nhân Viên Lập', key: 'nvlap' },
        { label: 'Mã Nhân Viên Giao', key: 'nvgiao' },
        { label: 'Danh Sách Mặt Hàng Xuất', key: 'chitiet' },
        { label: 'Tổng Tiền Thu Về (VND)', key: 'tongtien', type: 'number', title: 'Chỉ nhập số' }
    ],
    khohang: [
        { label: 'Mã Kho', key: 'ma', readonly: true, pattern: '^[A-Za-z0-9]+$', title: 'Chỉ nhập chữ và số, không nhập ký tự đặc biệt' },
        { label: 'Mã Hàng', key: 'mahang' },
        { label: 'Tên Hàng', key: 'tenhang' },
        { label: 'Số Lượng Tồn Kho', key: 'soluongton', type: 'number', title: 'Chỉ nhập số' },
        { label: 'Số Lượng Dư Thừa', key: 'soluongduthua', type: 'number', title: 'Chỉ nhập số' },
        { label: 'Ghi Chú', key: 'ghichu' }
    ]
};

const database = {
    hanghoa: [],
    nhacungcap: [],
    khachhang: [],
    nhanvien: [],
    phieunhap: [],
    phieuxuat: [],
    khohang: []
};

let modalState = { mode: 'add', type: null, index: null };

window.addEventListener('DOMContentLoaded', () => {
    loadDatabase();
    renderAllTables();

    const form = document.getElementById('dynamicForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }

    const searchInput = document.getElementById('globalSearch');
    if (searchInput) {
        searchInput.addEventListener('input', searchActiveTable);
    }

    const modal = document.getElementById('dataModal');
    if (modal) {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });
    }
});

function loadDatabase() {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            Object.keys(database).forEach((type) => {
                if (Array.isArray(parsed[type])) {
                    database[type] = parsed[type];
                } else {
                    database[type] = parseTableHtml(type);
                }
            });
            return;
        } catch (error) {
            console.warn('Không đọc được dữ liệu localStorage:', error);
        }
    }

    initDatabaseFromHtml();
    saveDatabase();
}

function initDatabaseFromHtml() {
    Object.keys(database).forEach((type) => {
        database[type] = parseTableHtml(type);
    });
}

function parseTableHtml(type) {
    const table = document.getElementById(`table-${type}`);
    const config = tableConfigs[type];
    if (!table || !config) {
        return [];
    }

    return Array.from(table.querySelectorAll('tbody tr')).map((row) => {
        const cells = Array.from(row.querySelectorAll('td'));
        const item = {};

        config.forEach((field, index) => {
            let value = cells[index] ? cells[index].innerText.trim() : '';
            item[field.key] = value;
        });

        return item;
    });
}

function saveDatabase() {
    localStorage.setItem(storageKey, JSON.stringify(database));
}

function renderAllTables() {
    Object.keys(database).forEach((type) => renderTable(type));
}

function renderTable(type) {
    const table = document.getElementById(`table-${type}`);
    if (!table) return;

    const tbody = table.querySelector('tbody');
    tbody.innerHTML = '';

    database[type].forEach((item, index) => {
        const row = document.createElement('tr');
        row.dataset.index = index;

        tableConfigs[type].forEach((field) => {
            const cell = document.createElement('td');
            cell.textContent = item[field.key] || '';
            row.appendChild(cell);
        });

        const actionCell = document.createElement('td');
        actionCell.innerHTML = `
            <button class="btn-action btn-edit" type="button" onclick="openEditModal(this, '${type}')">Sửa</button>
            <button class="btn-action btn-delete" type="button" onclick="triggerDelete(this, '${type}')">Xóa</button>
        `;
        row.appendChild(actionCell);
        tbody.appendChild(row);
    });

    searchActiveTable();
    updateHomeOverview();
}

function updateHomeOverview() {
    const counts = {
        hanghoa: database.hanghoa.length,
        nhacungcap: database.nhacungcap.length,
        khachhang: database.khachhang.length,
        nhanvien: database.nhanvien.length,
        phieunhap: database.phieunhap.length,
        phieuxuat: database.phieuxuat.length,
        khohang: database.khohang.length
    };

    const setText = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    };

    setText('homeCountHanghoa', counts.hanghoa);
    setText('homeCountNCC', counts.nhacungcap);
    setText('homeCountKH', counts.khachhang);
    setText('homeCountNV', counts.nhanvien);
    setText('homeCountPN', counts.phieunhap);
    setText('homeCountPX', counts.phieuxuat);
    setText('homeCountKHO', counts.khohang);

    const lowStockBody = document.getElementById('lowStockBody');
    if (!lowStockBody) return;

    lowStockBody.innerHTML = '';
    const lowStockItems = database.khohang.filter(item => {
        const qty = Number(item.soluongton);
        return !Number.isNaN(qty) && qty <= 20;
    }).slice(0, 10);

    if (lowStockItems.length === 0) {
        lowStockBody.innerHTML = '<tr><td colspan="4">Không có mặt hàng tồn thấp.</td></tr>';
    } else {
        lowStockItems.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.ma || ''}</td>
                <td>${item.mahang || ''}</td>
                <td>${item.soluongton || ''}</td>
                <td>${item.ghichu || ''}</td>
            `;
            lowStockBody.appendChild(row);
        });
    }

    renderRecentTransactions();
    renderGrowthChart();
}

function renderRecentTransactions() {
    const importBody = document.getElementById('recentImportBody');
    const exportBody = document.getElementById('recentExportBody');
    if (!importBody || !exportBody) return;

    const parseDate = (value) => {
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? null : date;
    };

    const sortByDateDesc = (items, dateKey) => {
        return [...items].sort((a, b) => {
            const da = parseDate(a[dateKey]);
            const db = parseDate(b[dateKey]);
            if (da && db) return db - da;
            if (da) return -1;
            if (db) return 1;
            return 0;
        });
    };

    const recentImports = sortByDateDesc(database.phieunhap, 'ngay').slice(0, 5);
    const recentExports = sortByDateDesc(database.phieuxuat, 'ngay').slice(0, 5);

    const renderRows = (body, items, columns) => {
        body.innerHTML = '';
        if (items.length === 0) {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.colSpan = columns;
            cell.textContent = 'Không có giao dịch.';
            row.appendChild(cell);
            body.appendChild(row);
            return;
        }

        items.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.ma || ''}</td>
                <td>${item.ngay || ''}</td>
                <td>${item.ncc || item.kh || ''}</td>
                <td>${item.tongtien || ''}</td>
            `;
            body.appendChild(row);
        });
    };

    renderRows(importBody, recentImports, 4);
    renderRows(exportBody, recentExports, 4);
}

function parseCurrencyValue(value) {
    const cleaned = String(value || '').replace(/[^\d.-]/g, '');
    const parsed = Number(cleaned);
    return Number.isNaN(parsed) ? 0 : parsed;
}

function formatCurrencyValue(value) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0
    }).format(value);
}

function renderGrowthChart() {
    const svg = document.getElementById('growthChart');
    const summary = document.getElementById('growthChartSummary');
    if (!svg) return;

    const entries = [...database.phieunhap, ...database.phieuxuat]
        .filter(item => item.ngay)
        .map(item => ({
            date: item.ngay,
            type: item.ncc ? 'import' : 'export',
            value: parseCurrencyValue(item.tongtien)
        }));

    const grouped = new Map();
    entries.forEach(entry => {
        const key = entry.date;
        if (!grouped.has(key)) {
            grouped.set(key, { date: key, import: 0, export: 0 });
        }
        const bucket = grouped.get(key);
        bucket[entry.type] += entry.value;
    });

    const points = Array.from(grouped.values()).sort((a, b) => new Date(a.date) - new Date(b.date));

    svg.innerHTML = '';

    if (points.length === 0) {
        svg.setAttribute('height', '0');
        if (summary) summary.textContent = 'Chưa có dữ liệu giao dịch để hiển thị biểu đồ.';
        return;
    }

    svg.setAttribute('height', '280');

    const width = 700;
    const height = 260;
    const padding = 40;
    const plotWidth = width - padding * 2;
    const plotHeight = height - padding * 2;
    const maxValue = Math.max(...points.map(point => Math.max(point.import, point.export)), 1);
    const step = Math.ceil(maxValue / 4 / 100000) * 100000;
    const yMax = Math.max(step * 4, maxValue);
    const yLabels = [0, 1, 2, 3, 4].map(index => yMax - index * (yMax / 4));

    const gridLines = yLabels.map((value, index) => {
        const y = padding + (index * plotHeight) / 4;
        return `<line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" stroke="#e9ecef" stroke-dasharray="4 4" />`;
    }).join('');

    const yLabelMarkup = yLabels.map((value, index) => {
        const y = padding + (index * plotHeight) / 4;
        return `<text x="${padding - 12}" y="${y + 4}" text-anchor="end" font-size="11" fill="#6c757d">${formatCurrencyValue(value)}</text>`;
    }).join('');

    const xLabels = points.map((point, index) => {
        const x = padding + (index * plotWidth) / Math.max(points.length - 1, 1);
        const dateLabel = new Date(point.date).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit'
        });
        return `<text x="${x}" y="${height - 12}" text-anchor="middle" font-size="11" fill="#6c757d">${dateLabel}</text>`;
    }).join('');

    const createLine = (key) => {
        const coords = points.map((point, index) => {
            const x = padding + (index * plotWidth) / Math.max(points.length - 1, 1);
            const y = height - padding - (point[key] / yMax) * plotHeight;
            return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
        }).join(' ');
        return coords;
    };

    const importPath = createLine('import');
    const exportPath = createLine('export');

    const importDots = points.map((point, index) => {
        const x = padding + (index * plotWidth) / Math.max(points.length - 1, 1);
        const y = height - padding - (point.import / yMax) * plotHeight;
        return `<circle cx="${x}" cy="${y}" r="4" fill="#0d6efd" />`;
    }).join('');

    const exportDots = points.map((point, index) => {
        const x = padding + (index * plotWidth) / Math.max(points.length - 1, 1);
        const y = height - padding - (point.export / yMax) * plotHeight;
        return `<circle cx="${x}" cy="${y}" r="4" fill="#198754" />`;
    }).join('');

    svg.innerHTML = `
        ${gridLines}
        ${yLabelMarkup}
        ${xLabels}
        <path d="${importPath}" fill="none" stroke="#0d6efd" stroke-width="3" stroke-linecap="round" />
        <path d="${exportPath}" fill="none" stroke="#198754" stroke-width="3" stroke-linecap="round" />
        ${importDots}
        ${exportDots}
    `;

    const totalImport = points.reduce((sum, point) => sum + point.import, 0);
    const totalExport = points.reduce((sum, point) => sum + point.export, 0);
    if (summary) {
        summary.textContent = `Tổng nhập: ${formatCurrencyValue(totalImport)} | Tổng xuất: ${formatCurrencyValue(totalExport)}`;
    }
}

function openAddModal(type) {
    modalState = { mode: 'add', type, index: null };
    buildModalForm(type, null);
    document.getElementById('modalTitle').innerText = 'Thêm Mới Dữ Liệu';
    document.getElementById('dataModal').style.display = 'flex';
}

function openEditModal(button, type) {
    const row = button.closest('tr');
    const table = row.closest('table');
    const resolvedType = type || (table ? table.id.replace('table-', '') : null);
    const index = Number(row.dataset.index || Array.from(row.parentElement.children).indexOf(row));
    modalState = { mode: 'edit', type: resolvedType, index };
    const item = database[resolvedType][index] || {};
    buildModalForm(resolvedType, item);
    document.getElementById('modalTitle').innerText = 'Cập Nhật Thông Tin';
    document.getElementById('dataModal').style.display = 'flex';
}

function buildModalForm(type, item) {
    const container = document.getElementById('formInputsContainer');
    container.innerHTML = '';

    tableConfigs[type].forEach((field) => {
        const group = document.createElement('div');
        group.className = 'form-group';
        group.style.marginBottom = '15px';

        const label = document.createElement('label');
        label.style.cssText = 'font-weight:600; display:block; margin-bottom:6px; color:#333; font-size:14px;';
        label.textContent = field.label;

        const input = document.createElement('input');
        input.type = field.type || 'text';
        input.name = field.key;
        input.value = item ? (item[field.key] || '') : '';
        input.placeholder = item ? '' : `Nhập ${field.label.toLowerCase()}...`;
        input.required = true;
        input.style.cssText = 'width:100%; padding:10px; border:1px solid #ccc; border-radius:4px; font-size:14px; box-sizing:border-box;';

        if (field.pattern) {
            input.pattern = field.pattern;
            if (field.title) {
                input.title = field.title;
            }
        }

        if (field.type === 'number') {
            input.step = '1';
            input.min = '0';
            input.inputMode = 'numeric';
        }

        if (field.type === 'tel') {
            input.inputMode = 'numeric';
        }

        input.addEventListener('input', () => {
            if (field.pattern === '^[0-9]+$') {
                input.value = input.value.replace(/\D/g, '');
            }
        });

        if (item && field.readonly) {
            input.readOnly = true;
            input.style.backgroundColor = '#f4f4f4';
            input.style.color = '#666';
            input.style.cursor = 'not-allowed';
        }

        group.appendChild(label);
        group.appendChild(input);
        container.appendChild(group);
    });
}

function handleFormSubmit(event) {
    event.preventDefault();

    const { type, mode, index } = modalState;
    if (!type) return;

    const form = document.getElementById('dynamicForm');
    if (form && !form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const inputs = Array.from(document.querySelectorAll('#formInputsContainer input'));
    const obj = {};
    const config = tableConfigs[type];

    inputs.forEach((input, idx) => {
        const field = config[idx];
        obj[field.key] = input.value.trim();
    });

    const normalizedMa = obj.ma ? obj.ma.trim().toLowerCase() : '';
    if (!normalizedMa) {
        alert('Vui lòng nhập mã hợp lệ.');
        return;
    }

    const duplicateIndex = database[type].findIndex((item, idx) => item.ma.trim().toLowerCase() === normalizedMa && idx !== index);
    if (duplicateIndex !== -1) {
        alert('Mã đã tồn tại. Vui lòng nhập mã khác.');
        return;
    }

    if (mode === 'add') {
        database[type].push(obj);
    } else {
        database[type][index] = obj;
    }

    saveDatabase();
    renderTable(type);
    closeModal();
}

function triggerDelete(button, type) {
    const row = button.closest('tr');
    const table = row.closest('table');
    const resolvedType = type || (table ? table.id.replace('table-', '') : null);

    if (!resolvedType) {
        return;
    }

    if (!confirm('Bạn có chắc muốn xóa dòng dữ liệu này?')) {
        return;
    }

    const index = Number(row.dataset.index || Array.from(row.parentElement.children).indexOf(row));
    database[resolvedType].splice(index, 1);
    saveDatabase();
    renderTable(resolvedType);
}

function switchTab(event, tabId) {
    document.querySelectorAll('.tab-panel').forEach((panel) => panel.classList.remove('active'));
    document.querySelectorAll('.menu-item, .sidebar-brand').forEach((item) => item.classList.remove('active'));
    const targetPanel = document.getElementById(tabId);
    if (targetPanel) {
        targetPanel.classList.add('active');
    }
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
    const searchInput = document.getElementById('globalSearch');
    if (searchInput) {
        searchInput.value = '';
    }
    searchActiveTable();
}

function searchActiveTable() {
    const filter = document.getElementById('globalSearch').value.toLowerCase();
    const activePanel = document.querySelector('.tab-panel.active');
    if (!activePanel) return;

    const rows = Array.from(activePanel.querySelectorAll('tbody tr'));
    rows.forEach((row) => {
        row.style.display = row.innerText.toLowerCase().includes(filter) ? '' : 'none';
    });
}

function closeModal() {
    const modal = document.getElementById('dataModal');
    if (modal) {
        modal.style.display = 'none';
    }
}
