package {
	import flash.display.Sprite;
	import TextFieldY;
	import flash.text.TextFormat;
	import org.flashdevelop.utils.FlashConnect;
	import br.com.stimuli.string.printf;
	
	public class YAxisLabelsBase extends Sprite {
		private var steps:Number;
		private var right:Boolean;
		
		public function YAxisLabelsBase( values:Array, steps:Number, json:Object, name:String, style_name:String ) {

			this.steps = steps;
			
			var style:YLabelStyle = new YLabelStyle( json, name );
			
			// are the Y Labels visible?
			if( !style.show_labels )
				return;
				
			// labels
			var pos:Number = 0;
			
			for each ( var v:Object in values )
			{
				var tmp:TextFieldY = this.make_label( v.val, style );
				tmp.y_val = v.pos;
				this.addChild(tmp);
				
				pos++;
			}
		}

		//
		// use Y Min, Y Max and Y Steps to create an array of
		// Y labels:
		//
		protected function make_labels( min:Number, max:Number, right:Boolean, steps:Number ):Array {
			var values:Array = [];
			
			var min_:Number = Math.min( min, max );
			var max_:Number = Math.max( min, max );
			
			// hack: hack: http://kb.adobe.com/selfservice/viewContent.do?externalId=tn_13989&sliceId=1
			max_ += 0.000004;
			
			var eek:Number = 0;
			for( var i:Number = min_; i <= max_; i+=steps ) {
				
				values.push( { val:printf('%.3f',i), pos:i } );
				
				// make sure we don't generate too many labels:
				if( eek++ > 250 ) break;
			}
			return values;
		}
		
		private function make_label( title:String, style:YLabelStyle ):TextFieldY
		{
			
			
			// does _root already have this textFiled defined?
			// this happens when we do an AJAX reload()
			// these have to be deleted by hand or else flash goes wonky.
			// In an ideal world we would put this code in the object
			// distructor method, but I don't think actionscript has these :-(

			
			var tf:TextFieldY = new TextFieldY();
			//tf.border = true;
			tf.text = title;
			var fmt:TextFormat = new TextFormat();
			fmt.color = style.colour;
			fmt.font = "Verdana";
			fmt.size = style.size;
			fmt.align = "right";
			tf.setTextFormat(fmt);
			tf.autoSize="right";
			return tf;
		}

		// move y axis labels to the correct x pos
		public function resize( left:Number, sc:ScreenCoords ):void
		{
		}


		public function get_width():Number{
			var max:Number = 0;
			for( var i:Number=0; i<this.numChildren; i++ )
			{
				var tf:TextFieldY = this.getChildAt(i) as TextFieldY;
				max = Math.max( max, tf.width );
			}
			return max;
		}
		
		public function die(): void {
			
			while ( this.numChildren > 0 )
				this.removeChildAt(0);
		}
	}
}