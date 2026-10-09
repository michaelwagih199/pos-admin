export class Arabic {
  error = {
    "Product Saved In System": "المنتج حفظ فى المخزن من قبل"
  }
  util = {
    searchfilter: "بحث عن طريق",
    searchfilterByCustomerName: "بحث بالعميل",
    byName: "الاسم",
    byCode: "الكود",
    saved: "تم الحفظ",
    date: "التاريخ",
    tables: {
      id: 'م',
      name: 'الاسم',
      phone: 'موبايل',
      notes: 'ملاحظات',
    },
    dialogButtons: {
      ok: "نعم",
      cancel: "إلغاء",
    },
  }
  customerPayment = {
    title: "دفعة عميل",
    customerSection: "بيانات العميل",
    paymentSection: "بيانات الدفعة",
    customer: "العميل",
    searchPlaceholder: "ابحث باسم العميل...",
    paymentDate: "تاريخ الدفعة",
    paymentValue: "قيمة الدفعة",
    notes: "ملاحظات",
    currentBalance: "المتبقي الحالي",
    remainingAfter: "المتبقي بعد الدفعة",
    currency: "ج.م",
    save: "حفظ",
    reset: "مسح",
    close: "إغلاق",
    savedSuccess: "✅ تم حفظ الدفعة بنجاح",
    saveFailed: "فشل حفظ الدفعة",
    customerNotFound: "لم يتم العثور على العميل",
    customerRequired: "يجب اختيار العميل",
    overPaymentWarning: "⚠️ قيمة الدفعة أكبر من المتبقي الحالي",

  };


  collectorReport = {
    title: "تقرير المحصّل",
    print: "طباعة",              // ← NEW
    printedAt: "تم الطباعة في",  // ← NEW
    exportExcel: "تصدير Excel",
    totalCollected: "إجمالي التحصيلات",
    customerCount: "عدد العملاء",
    currency: "ج.م",
    emptyTitle: "لا يوجد عملاء",
    emptyHint: "لا توجد بيانات لعرضها",
    table: {
      index: "م",
      customerName: "اسم العميل",
      lastPaymentDate: "آخر دفعة",
      collectedAmount: "إجمالي المحصل",
      remainingDebt: "المديونية",
    },
  };

  customerStatement = {
    title: "كشف حساب عميل",
    customer: "العميل",
    from: "من تاريخ",
    to: "إلى تاريخ",
    show: "عرض الكشف",
    print: "طباعة",
    openingBalance: "رصيد افتتاحي",
    totalOrders: "إجمالي الطلبات",
    totalPayments: "إجمالي الدفعات",
    totalReturns: "إجمالي المرتجعات",
    closingBalance: "الرصيد الحالي",
    ordersSection: "تفاصيل الطلبات",
    paymentsSection: "تفاصيل الدفعات",
    retrievalsSection: "تفاصيل المرتجعات",
    refundCredit: "رصيد",
    refundCash: "كاش",
    noOrders: "لا توجد طلبات في هذه الفترة",
    noPayments: "لا توجد دفعات في هذه الفترة",
    noRetrievals: "لا توجد مرتجعات في هذه الفترة",
    emptyTitle: "لم يتم العثور على بيانات",
    emptyHint: "تأكد من اختيار عميل ثم اضغط «عرض الكشف»",
    generatedAt: "تم الإنشاء في",
    table: {
      date: "التاريخ",
      code: "الكود",
      total: "الإجمالي",
      paid: "المدفوع",
      remaining: "المتبقي",
      value: "القيمة",
      notes: "ملاحظات",
      net: "الصافي",
      refund: "طريقة الرد",
    },
  };

  supplierStatement = {
    title: "كشف حساب مورد",
    supplier: "المورد",
    from: "من تاريخ",
    to: "إلى تاريخ",
    show: "عرض الكشف",
    print: "طباعة",
    detailedReport: "كشف مفصل",
    openingBalance: "رصيد افتتاحي (ما علينا له)",
    totalPurchases: "إجمالي المشتريات",
    totalPayments: "إجمالي السداد",
    totalReturns: "إجمالي المرتجعات",
    closingBalance: "الرصيد المتبقي النهائي",
    purchasesSection: "تفاصيل فواتير المشتريات",
    paymentsSection: "تفاصيل عمليات السداد والمدفوعات",
    retrievalsSection: "تفاصيل مرتجعات المشتريات",
    refundCredit: "رصيد",
    refundCash: "كاش",
    noPurchases: "لا توجد فواتير مشتريات في هذه الفترة",
    noPayments: "لا توجد مدفوعات في هذه الفترة",
    noRetrievals: "لا توجد مرتجعات في هذه الفترة",
    emptyTitle: "لم يتم العثور على بيانات",
    emptyHint: "تأكد من اختيار مورد ثم اضغط «عرض الكشف»",
    generatedAt: "تم الإنشاء في",
    table: {
      date: "التاريخ",
      code: "الكود",
      total: "الإجمالي",
      paid: "المدفوع",
      remaining: "المتبقي",
      value: "القيمة",
      notes: "ملاحظات",
      net: "الصافي",
      refund: "طريقة الرد",
      lineCount: "عدد البنود",
      product: "الصنف",
      rolls: "الأتواب",
      quantity: "الكمية",
      unitPrice: "سعر الوحدة",
      reason: "السبب",
      method: "طريقة الدفع",
    },
  };


  dailySafeReport = {
    title: "تقرير الخزنة اليومي",
    date: "التاريخ",
    show: "عرض التقرير",
    today: "اليوم",
    reportDate: "تاريخ التقرير",
    customerPayments: "دفعات العملاء",
    cashSales: "مبيعات كاش",
    cashRetrievals: "مرتجعات العملاء (كاش)",
    total: "الإجمالي",
    notes: "ملاحظات",
    print: "طباعة",
    currency: "ج.م",

    // Labels
    allSales: "إجمالي المبيعات",
    purchases: "المشتريات",
    allPurchases: "إجمالي المشتريات",
    allRetrievals: "إجمالي المرتجعات",
    supplier: "المورد",
    party: "الطرف (عميل / مورد)",
    paymentType: "طريقة الدفع",
    paid: "المدفوع",
    remaining: "المتبقي",
    totalBill: "إجمالي الفاتورة",
    returnType: "نوع المرتجع",

    receiptCode: "رقم الإيصال",
    invoiceCode: "رقم الفاتورة",
    billCode: "رقم فاتورة الشراء",
    returnCode: "رقم المرتجع",
    customer: "العميل",
    phone: "الهاتف",
    reference: "البيان / المرجع",
    dateCol: "التاريخ",
    amount: "المبلغ",
    reason: "السبب / النوع",
    sectionCount: "عدد الحركات",
    empty: "لا توجد حركات في هذا القسم",
  };


  navBarList = {
    seling: "بيع",
    customers: "العملاء",
    customerPayment: "دفعة عميل",
    suppliers: "الموردين",
    purshasing: "المشتريات",
    retrival: "المرتجع",
    stock: "المخزن",
    expenses: "المصروفات",
    maintenance: "الصيانة",
    reports: "التقارير",
    setting: "الاعدادات",
    aboutApp: "عن التطبيق",
  }

  stock = {
    tabs: {
      tab1: "التصنيفات",
      tab2: "المنتجات"
    },
    category: {
      util: {
        searchBar: "البحث فى التصنيفات",
        dialog: {
          addDialog: {
            title: "حفظ التصنيف",
            buttons: {
              save: "حفظ",
              cancel: "إلغاء",
            }
          },
          deleteDialog: {
            title: "هل تريد المسح"
          },
          dialogButtons: {
            ok: "نعم",
            cancel: "إلغاء",
          },
          notification: {
            deleted: "تم المسح",
            saved: "تم الحفظ"
          }
        }
      },
      table: {
        name: "اﻷسم"
      }
    },
    products: {
      table: {
        productName: "الاسم",
        retailPrice: "سعر التجزئة",
        purchasingPrice: "سعر الشراء",
        numberUnitsInStock: "عدد القطع",
        alertUnits: "الحد الادنى",
        expirationDate: "انتهاء الصلاحة",
        productCategory: "التصنيف",
        wholesalePrice: "السعر",
        productCode: "كود الصنف",
        title: "اضافة الصنف",
        measurementUnit: 'وحدة القياس',
        unitNumber: 'عدد الاتواب'
      },
      util: {
        automaticCode: "ليس له كود",
        searchBar: "البحث فى المنتجات",

      }
    }

  }

  customers = {
    util: {
      searchBar: "بحث فى العملاء",
      paymentValue: "قيمة الدفعة",
      paymentDate: "تاريخ الدفعه",
      addPayment: "اضافة الدفعة",
      allPayment: "اجمالى المدفوعات",
      remaining: "المتبقى",
      orders: "الطلبات",
      fromDate: "من تاريخ",
      toDate: "الى تاريخ",
      search: "بحث",
      reset: "مسح",
      orderCode: "رقم الفاتورة",
      orderDate: "تاريخ الطلب",
      totalOrder: "اجمالى الطلب",
      paid: "المدفوع",
      paymentType: "طريقة الدفع",
      orderType: "نوع الطلب",
      totalOrders: "عدد الطلبات",
      totalOrderAmount: "اجمالى الطلبات",
      totalPaid: "اجمالى المدفوع",
      totalRemaining: "اجمالى المتبقى"
    }
  }

  saleOrder = {
    util: {
      orderType: "نوع الطلب",
      paymentType: "طريقة الدفع",
      orderCode: "رقم الفاتورة",
      orderTypeSelection: {
        wholesale: "جملة",
        retailseal: "تجزئه"
      },
      paymentTypeSelection: {
        cash: "كاش",
        installment: "تقسيط",
        oncredit: "آجل",
        installmentValue: "نسبه التقسيط %"
      },
      dynamicOrderMessage: {
        CANT_FIND_PRODUCT: "المنتج غير موجود",
        QUANTITY_NOT_ENOUGH_IN_STOCK: "الكمية فى المخزن لا تكفى",
        ALERT_QUANTITY: "الكمية فى المخزن ستقل الى الاحد الادنى ",
        EXPIRED_PRODUCT: "المنتج منهى الصلاحية",
      }
    },
    table: {

    }
  }
}
