<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="88px">
      <el-form-item label="供应商" prop="supplierId">
        <el-select v-model="queryParams.supplierId" placeholder="请选择供应商" clearable>
          <el-option
            v-for="item in supplierOptions"
            :key="item.supplierId"
            :label="item.supplierName"
            :value="item.supplierId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="型号名称" prop="modelName">
        <el-input
          v-model="queryParams.modelName"
          placeholder="请输入型号名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="系列" prop="series">
        <el-input
          v-model="queryParams.series"
          placeholder="请输入系列"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="状态" clearable>
          <el-option
            v-for="dict in dict.type.sys_normal_disable"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['pms:barebone:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['pms:barebone:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="el-icon-s-data"
          size="mini"
          :disabled="multiple"
          @click="handleCompare"
          v-hasPermi="['pms:barebone:list']"
        >SPU对比</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['pms:barebone:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="bareboneList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="供应商" align="center" prop="supplierName" />
      <el-table-column label="型号名称" align="center" prop="modelName" :show-overflow-tooltip="true" />
      <el-table-column label="系列" align="center" prop="series" />
      <el-table-column label="CPU规格" align="center" prop="cpuSpec" :show-overflow-tooltip="true" />
      <el-table-column label="屏幕规格" align="center" prop="screenSpec" />
      <el-table-column label="颜色" align="center" prop="color" />
      <el-table-column label="基础价(USD)" align="center" prop="basePrice" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.basePrice ? '$' + scope.row.basePrice.toFixed(2) : '$0.00' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="1"
            inactive-value="0"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-setting"
            @click="handleConfigAccessories(scope.row)"
            v-hasPermi="['pms:barebone:edit']"
          >配置配件</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['pms:barebone:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['pms:barebone:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改基础型号对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="供应商" prop="supplierId">
              <el-select v-model="form.supplierId" placeholder="请选择供应商">
                <el-option
                  v-for="item in supplierOptions"
                  :key="item.supplierId"
                  :label="item.supplierName"
                  :value="item.supplierId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="型号名称" prop="modelName">
              <el-input v-model="form.modelName" placeholder="请输入型号名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="系列" prop="series">
              <el-input v-model="form.series" placeholder="请输入系列" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="CPU规格" prop="cpuSpec">
              <el-input v-model="form.cpuSpec" placeholder="请输入CPU规格" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="屏幕规格" prop="screenSpec">
              <el-input v-model="form.screenSpec" placeholder="请输入屏幕规格" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="颜色" prop="color">
              <el-input v-model="form.color" placeholder="请输入颜色" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="基础价(USD)" prop="basePrice">
              <el-input-number v-model="form.basePrice" :precision="2" :min="0" placeholder="基础价格" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in dict.type.sys_normal_disable"
                  :key="dict.value"
                  :label="dict.value"
                >{{ dict.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 配置配件对话框 -->
    <el-dialog title="配置配件" :visible.sync="accessoryOpen" width="800px" append-to-body>
      <el-table v-loading="accessoryLoading" :data="accessoryList" @selection-change="handleAccessorySelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="配件类型" align="center" prop="typeName" />
        <el-table-column label="配件值" align="center" prop="valueName" />
        <el-table-column label="规格描述" align="center" prop="specification" :show-overflow-tooltip="true" />
        <el-table-column label="加价(USD)" align="center" prop="addPrice">
          <template slot-scope="scope">
            <span>{{ scope.row.addPrice ? '$' + scope.row.addPrice.toFixed(2) : '$0.00' }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitAccessories">确 定</el-button>
        <el-button @click="accessoryOpen = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- SPU对比对话框 -->
    <el-dialog title="SPU对比" :visible.sync="compareOpen" width="90%" append-to-body>
      <el-table v-loading="compareLoading" :data="compareList" border>
        <el-table-column label="对比项" align="center" prop="fieldName" width="120" fixed />
        <el-table-column v-for="(item, index) in compareColumns" :key="index" :label="item.modelName" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row['value' + index] }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="compareOpen = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listBarebone, getBarebone, delBarebone, addBarebone, updateBarebone, listAccessories, bindAccessories, compare } from "@/api/pms/barebone"
import { listSupplier } from "@/api/pms/supplier"
import { listAccessoryValue } from "@/api/pms/accessoryValue"

export default {
  name: "Barebone",
  dicts: ['sys_normal_disable'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 基础型号表格数据
      bareboneList: [],
      // 供应商选项
      supplierOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 配件配置弹出层
      accessoryOpen: false,
      accessoryLoading: false,
      accessoryList: [],
      selectedAccessories: [],
      currentBareboneId: undefined,
      // SPU对比
      compareOpen: false,
      compareLoading: false,
      compareList: [],
      compareColumns: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        supplierId: undefined,
        modelName: undefined,
        series: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        supplierId: [
          { required: true, message: "请选择供应商", trigger: "change" }
        ],
        modelName: [
          { required: true, message: "型号名称不能为空", trigger: "blur" }
        ]
      }
    }
  },
  created() {
    this.getList()
    this.getSupplierList()
  },
  methods: {
    /** 查询供应商列表 */
    getSupplierList() {
      listSupplier({ pageNum: 1, pageSize: 1000, status: '1' }).then(response => {
        this.supplierOptions = response.rows
      })
    },
    /** 查询基础型号列表 */
    getList() {
      this.loading = true
      listBarebone(this.queryParams).then(response => {
        this.bareboneList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        bareboneId: undefined,
        supplierId: undefined,
        modelName: undefined,
        series: undefined,
        cpuSpec: undefined,
        screenSpec: undefined,
        color: undefined,
        basePrice: 0,
        status: "1",
        remark: undefined
      }
      this.resetForm("form")
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm")
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.bareboneId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = "添加基础型号"
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const bareboneId = row.bareboneId || this.ids
      getBarebone(bareboneId).then(response => {
        this.form = response.data
        this.open = true
        this.title = "修改基础型号"
      })
    },
    /** 基础型号状态修改 */
    handleStatusChange(row) {
      let text = row.status === "1" ? "启用" : "停用"
      this.$modal.confirm('确认要"' + text + '""' + row.modelName + '"基础型号吗？').then(function() {
        return updateBarebone({ bareboneId: row.bareboneId, status: row.status })
      }).then(() => {
        this.$modal.msgSuccess(text + "成功")
      }).catch(function() {
        row.status = row.status === "1" ? "0" : "1"
      })
    },
    /** 配置配件 */
    handleConfigAccessories(row) {
      this.currentBareboneId = row.bareboneId
      this.accessoryLoading = true
      this.accessoryOpen = true
      // 获取所有配件值
      listAccessoryValue({ pageNum: 1, pageSize: 10000, status: '1' }).then(response => {
        this.accessoryList = response.rows
        // 获取已绑定的配件
        listAccessories(row.bareboneId).then(res => {
          const bindedIds = res.data.map(item => item.valueId)
          this.$nextTick(() => {
            this.accessoryList.forEach(item => {
              if (bindedIds.includes(item.valueId)) {
                this.$refs.accessoryTable && this.$refs.accessoryTable.toggleRowSelection(item, true)
              }
            })
          })
          this.accessoryLoading = false
        })
      })
    },
    // 配件选择变化
    handleAccessorySelectionChange(selection) {
      this.selectedAccessories = selection
    },
    // 提交配件配置
    submitAccessories() {
      const valueIds = this.selectedAccessories.map(item => item.valueId)
      bindAccessories(this.currentBareboneId, valueIds).then(response => {
        this.$modal.msgSuccess("配件配置成功")
        this.accessoryOpen = false
      })
    },
    /** SPU对比 */
    handleCompare() {
      if (this.ids.length < 2) {
        this.$modal.msgWarning("请至少选择2个SPU进行对比")
        return
      }
      this.compareLoading = true
      this.compareOpen = true
      compare(this.ids).then(response => {
        this.compareList = response.data.rows
        this.compareColumns = response.data.columns
        this.compareLoading = false
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.bareboneId != undefined) {
            updateBarebone(this.form).then(response => {
              this.$modal.msgSuccess("修改成功")
              this.open = false
              this.getList()
            })
          } else {
            addBarebone(this.form).then(response => {
              this.$modal.msgSuccess("新增成功")
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const bareboneIds = row.bareboneId || this.ids
      this.$modal.confirm('是否确认删除基础型号编号为"' + bareboneIds + '"的数据项？').then(function() {
        return delBarebone(bareboneIds)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess("删除成功")
      }).catch(() => {})
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('pms/barebone/export', {
        ...this.queryParams
      }, `barebone_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>