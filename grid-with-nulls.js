function randomInteger(min, max) {
    return N =Math.floor(Math.random() * (max - min + 1)) + min
}
function is_elem_equal(el1,el2){
    if(el1[0]==el2[0]&&el1[1]==el2[1]){
        return is_equal = true
    }else return is_equal = false
}
function get_EP_element(ep){
    get_ep_element_dim=elements[ep]
    get_ep_element_arr = []
    
    for(e=get_ep_element_dim[1]; e<=ROW; e++){

        for(r=get_ep_element_dim[0]; r<=COL; r++){

            get_ep_element_arr.push([r,e])
        }
    }    
    return get_ep_element_arr
}
function get_range(ep,sp){
    element_range = []
    range_num_col = ep[0]-sp[0]+1
    range_num_row = ep[1]-sp[1]+1
    for(i=0;i<range_num_row;i++){
        for(k=0;k<range_num_col;k++){    
            element_range.push([ep[0]-k, ep[1]-i])
        }
    }
    return element_range
}
function get_element_index_from_array(element, array){
    for(index_in_array=0;index_in_array<array.length;index_in_array++){
        if(is_elem_equal(array[index_in_array],element)){
            return index_in_array
        }
    }
}
function remove_element_all(arr, value) {
    var i = 0;
    while (i < arr.length) {
        if (arr[i] === value) {
            arr.splice(i, 1);
        } else {
            ++i;
        }
    }
    return arr;
}

myWindow = new Window ("palette");
myWindow.orientation = "column";
myWindow.add ("statictext", undefined, "Rows");
rows = myWindow.add ("edittext", undefined);
myWindow.add ("statictext", undefined, "Columns");
columns = myWindow.add ("edittext", undefined);

rows.characters = 5;
columns.characters = 5;

ok_btn = myWindow.add ("button", undefined, "OK");
again_btn = myWindow.add ("button", undefined, "Again");

ok_btn.onClick = function(){
    make_grid()
}
again_btn.onClick = function(){
    grid_again()
}
myWindow.show ();

function make_grid(){

app.beginUndoGroup("GRID")
comp = app.project.activeItem;


WIDTH = comp.width;
HEIGHT = comp.height;

output_elements = []

function make_anchors(ROW, COL){
    anchors = []
    for(i=1; i<ROW+1; i++){
        
        row_height =  HEIGHT/ROW
        row_middle = row_height/2
        current_row = i*row_height

        for(k=1; k<COL+1; k++){
        
            col_width = WIDTH/COL
            col_middle = col_width/2
            current_col = k*col_width
            
            Contents.addProperty("ADBE Vector Group").name = k+","+i
            Contents.property(k+","+i).property("ADBE Vectors Group").addProperty("ADBE Vector Shape - Ellipse")
            Contents.property(k+","+i).property("ADBE Vectors Group").
                property("ADBE Vector Shape - Ellipse").
                property("ADBE Vector Ellipse Size").setValue([10,10])

            Contents.property(k+","+i).
                property("ADBE Vector Transform Group").
                property("ADBE Vector Position").
                setValue([current_col-col_middle,current_row-row_middle])
        }
    }
    
    Contents.addProperty("ADBE Vector Graphic - Fill")
}

comp.layers.addShape().name = "anchors"
comp.layer("anchors").property("Transform").property("Position").setValue([0,0])
comp.layer("anchors").enabled = false

ROW = parseInt(rows.text, 10)
COL = parseInt(columns.text, 10)

Contents = comp.layer("anchors").property("ADBE Root Vectors Group")
make_anchors(ROW,COL)

DIM = COL * ROW

how_many_items = []
for(k=1; k<ROW+1; k++){
    for(i=1; i<COL+1; i++){
        how_many_items.push(i*k)
    }
}
how_many_items.reverse()

elements = []
for(k=1; k<ROW+1; k++){
    for(i=1; i<COL+1; i++){
        elements.push([i,k])
    }   
}

arr_with_false = []
for(i=0; i<elements.length; i++){
    arr_with_false.push(elements[i])
}

n1_ep = randomInteger(0, elements.length-1)
n1 = elements[n1_ep];
n1_end_points = get_EP_element(n1_ep)
n1_random_ep = randomInteger(0, n1_end_points.length-1)
n1_sp =[
    n1_end_points[n1_random_ep][0]-(elements[n1_ep][0]-1),
    n1_end_points[n1_random_ep][1]-(elements[n1_ep][1]-1)
];
n1_ep = n1_end_points[n1_random_ep]
n1_range = get_range(n1_ep, n1_sp)

output_elements.push(n1_range);

for(i=0; i<n1_range.length; i++){
    for(k=0; k<arr_with_false.length; k++){
        if( is_elem_equal(arr_with_false[k], n1_range[i]) ){
            arr_with_false[k] = []
            arr_with_false[k].push("false")
        }
    }
}


get_alloweded()
elem_check_false()
comps_to_grid()


function get_alloweded(){

    allowed_elements=[]

    for(i=0; i<elements.length; i++){
        
        current_elem_EP = get_EP_element(i)
        current_elem_EP_new=[]

        for(k=0; k<how_many_items[i]; k++){

            var index_of_EP_in_false_arr
            for(q=0; q<elements.length; q++){
                if( is_elem_equal(current_elem_EP[k], elements[q]) ){
                    index_of_EP_in_false_arr = q
                    break
                }else continue
            }

            
            if( is_elem_equal(current_elem_EP[k],arr_with_false[index_of_EP_in_false_arr]) ){
                current_elem_EP_new.push(current_elem_EP[k])
            }else{
                continue
            }
        }
        
        
        current_elem_new_SP=[]
        for(k=0; k<current_elem_EP_new.length; k++){
            current_elem_EP_new_SP=[
                current_elem_EP_new[k][0]-(elements[i][0]-1),
                current_elem_EP_new[k][1]-(elements[i][1]-1)
            ]
            current_elem_new_SP.push(current_elem_EP_new_SP)
        }
        
        current_element_ranges=[]
        for(k=0; k<current_elem_EP_new.length; k++){
            current_element_ranges.push([])
            current_EP = current_elem_EP_new[k]
            current_SP = current_elem_new_SP[k]
            
            current_num_col = current_EP[0]-current_SP[0]+1
            current_num_row = current_EP[1]-current_SP[1]+1
            for(q=0; q<current_num_row; q++){
                for(u=0;u<current_num_col;u++){
                    current_element_ranges[k].push([current_EP[0]-u, current_EP[1]-q])
                }
            }
        }

        for(k=0; k<current_element_ranges.length; k++){
            
            for(q=0; q<current_element_ranges[k].length; q++){
                
                element_index = get_element_index_from_array(current_element_ranges[k][q], elements)
                if(is_elem_equal(current_element_ranges[k][q], arr_with_false[element_index])){
                    if(q==current_element_ranges[k].length-1){
                        allowed_elements.push(current_element_ranges[k])
                        break
                    }
                }else{ 
                    break
                }
            }
        }
    }
}

function elem_check_false(){
    for(i=0; i<arr_with_false.length; i++){
        if(arr_with_false[i]!="false"){
            paste_next_element()
        }else{
            if(i==arr_with_false.length-1){
                return
            }
        }
    }
}

function paste_next_element(){
    new_random = randomInteger(0, allowed_elements.length-1);
    new_element = allowed_elements[new_random];
    output_elements.push(new_element);

    for(i=0; i<new_element.length; i++){
        for(k=0; k<arr_with_false.length; k++){
            if( is_elem_equal(new_element[i], arr_with_false[k]) ){
                arr_with_false[k]=[]
                arr_with_false[k].push("false")
            }else continue
        }
    }
    
    get_alloweded()

    elem_check_false()
}

function comps_to_grid(){
    for(i=0; i<output_elements.length; i++){

        first_output_point = output_elements[i][0]
            fp_string = first_output_point.toString()

        last_output_point = output_elements[i][output_elements[i].length-1]
            lp_string = last_output_point.toString()
        
        fp_position = comp.layer("anchors").property("Contents").
        property(fp_string).property("Transform").property("Position").value

        lp_position = comp.layer("anchors").property("Contents").
        property(lp_string).property("Transform").property("Position").value

        middle = [fp_position[0]+(lp_position[0]-fp_position[0])/2, fp_position[1]+(lp_position[1]-fp_position[1])/2]
        layer_name = middle.toString()+ " - "+ output_elements[i].toSource().toString()
        comp.layers.addNull().name = layer_name
        
        comp.layer(layer_name).property("Transform").property("Position").
        setValue([lp_position[0]-((WIDTH/COL)/2),lp_position[1]-((HEIGHT/ROW)/2)])

        null_pos = comp.layer(layer_name).property("Transform").property("Position").value
        rect_size = [
            ( fp_position[0] + ((WIDTH/COL)/2) )-null_pos[0],

            ( fp_position[1] + ((HEIGHT/ROW)/2) )-null_pos[1]
        ]

        comp.layer(layer_name).property("Transform").property("Scale").setValue(rect_size)
        app.executeCommand(app.findMenuCommandId("Center Anchor Point in Layer Content"))

    }
}
app.executeCommand(app.findMenuCommandId("Deselect All"))
app.endUndoGroup()
}


function grid_again(){
    app.executeCommand(app.findMenuCommandId("Undo GRID"))
    make_grid()
}
